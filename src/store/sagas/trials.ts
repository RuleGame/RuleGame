import { call, delay, put, race, select, takeEvery, take } from 'typed-redux-saga';
import { getType } from 'typesafe-actions';
import Papa from 'papaparse';
import { merge } from 'lodash';
import { Code, ErrorMsg, FinishCode, METHOD } from '../../utils/api';
import {
  activateBonus,
  giveUp,
  guess,
  invalidMove,
  loadNextBonus,
  move,
  pause,
  pick,
  recordDemographics,
  setBoard,
  setWorkerId,
  skipGuess,
  startTrials,
  submitDetails,
  unpause,
  validMove,
  setIsBotAssisted,
} from '../actions/board';
import { addMessage } from '../actions/message';
import { nextPage } from '../actions/page';
import { socketConnection } from '../actions/socket';
import { TakeEffect } from 'redux-saga/effects';
import { boardPositionToBxBy, FEEDBACK_DURATION } from '../../constants';
import { apiResolve, takeAction } from './utils/helpers';
import { addLayer } from '../actions/layers';
import { workerIdSelector } from '../selectors/board';
import { WebSocketService } from '../../middleware/socket';
import { eventChannel, EventChannel } from 'redux-saga';
import { SocketMessage } from '../../@types/index';
// import { dispatch } from 'rxjs/internal/observable/pairs';
// import { useDispatch, useSelector } from 'react-redux';
// import { goToPage } from '../../store/actions/page';
// import { Page } from '../../constants/Page';

function createSocketChannel(socket: WebSocket): EventChannel<SocketMessage> {
  return eventChannel((emitter) => {
    const handler = (msg: MessageEvent) => {
      const parts = msg.data.split(' ');
      const command = parts[0] + ' ' + parts[1];

      if (command === 'READY DIS') {
        emitter({ type: 'READY_DIS' });
      }
      //  else if (parts[0] === 'CHAT') {
      //   const messageText = parts.slice(1).join(' ');
      //   emitter({ type: 'CHAT', messageText });
      // }
    };

    socket.addEventListener('message', handler);

    // Return unsubscribe function
    return () => {
      socket.removeEventListener('message', handler);
    };
  });
}

function* processMessages(
  socketChannel: EventChannel<SocketMessage>,
): Generator<any, void, SocketMessage> {
  while (true) {
    const action: SocketMessage = yield take(socketChannel);
    if (action.type === 'READY_DIS') {
      // Break out of the loop once we get the ready signal.
      break;
    }
  }
}

function* trials(playerId?: string, exp?: string, uid?: number): Generator<any, void, any> {
  try {
    const {
      data: {
        error: playerError,
        errmsg: playerErrmsg,
        playerId: playerIdResponse,
        isCoopGame: isCurrentGameCoop,
        isAdveGame: isCurrentGameAdve,
        trialList: trialList,
      },
    } = yield* apiResolve(
      '/game-data/GameService2/player',
      METHOD.POST,
      { exp, ...(uid !== undefined && { uid }), ...(playerId !== undefined && { playerId }) },
      {},
    );
    if (playerError) {
      throw Error(`Error on /player: ${playerErrmsg}`);
    }

    playerId = playerIdResponse;
    yield* put(setWorkerId(playerId));
    // socket connect logic
    const ws = new WebSocketService();
    let socket: ReturnType<typeof ws.getSocket> | null = null;
    let socketChannel: EventChannel<SocketMessage> | null = null;
    if (isCurrentGameCoop || isCurrentGameAdve) {
      yield* put(socketConnection.request(playerId));

      try {
        const socketConnected = yield* call(ws.connect, playerId);

        if (socketConnected) {
          socket = ws.getSocket();
          if (!socket) {
            throw new Error('WebSocket connection is null');
          }

          yield* put(socketConnection.success(socket));
          socketChannel = createSocketChannel(socket);
        }
      } catch (error) {
        yield* put(
          socketConnection.failure(error instanceof Error ? error : new Error(String(error))),
        );
      }
    }

    let {
      // eslint-disable-next-line prefer-const
      data: { errmsg, error, ...data },
    } = yield* apiResolve(
      '/game-data/GameService2/mostRecentEpisode',
      METHOD.POST,
      { playerId },
      {},
    );

    const noEpisodeStarted = error && errmsg === ErrorMsg.FAILED_TO_FIND_ANY_EPISODE;
    const nonPlayableEpisode = !(
      data?.display?.finishCode === FinishCode.FINISH || data?.display?.finishCode === FinishCode.NO
    );
    const guessSaved = data?.display?.finishCode === FinishCode.FINISH && data?.display.guessSaved;
    if (noEpisodeStarted || nonPlayableEpisode || guessSaved) {
      const { data: newEpisodeData } = yield* apiResolve(
        '/game-data/GameService2/newEpisode',
        METHOD.POST,
        { playerId },
        {},
      );

      data = newEpisodeData;

      if (newEpisodeData.alreadyFinished !== true && newEpisodeData.error) {
        throw Error(`Error on /newEpisdoe: ${newEpisodeData.errmsg}`);
      }
    } else if (data.alreadyFinished !== true && error) {
      throw Error(`Error on /mostRecentEpisode ${errmsg}`);
    }

    let { alreadyFinished, episodeId, para, mustWait, display } = data;
    if (para) yield* put(setIsBotAssisted(para.bot_assist ?? ''));

    // TODO: Check if socket connection error is getting handles
    if (mustWait) {
      yield* put(nextPage());
      yield call(ws.waitForReadyEpi);
      //yield* put(addMessage('READY EPI'));
      let {
        // eslint-disable-next-line prefer-const
        data: { errmsg, error, ...data },
      } = yield* apiResolve(
        '/game-data/GameService2/mostRecentEpisode',
        METHOD.POST,
        { playerId },
        {},
      );

      ({ alreadyFinished, episodeId, para, mustWait, display } = data);
    } else {
      yield* put(nextPage());
    }

    yield* put(nextPage());

    while (!alreadyFinished) {
      const {
        grid_memory_show_order: gridMemoryShowOrder,
        stack_memory_show_order: stackMemoryShowOrder,
        stack_memory_depth: stackMemoryDepth,
        give_up_at: giveUpAt,
        feedback_switches: feedbackSwitches,
        x2_after: x2After,
        x4_after: x4After,
        x2_likelihood: x2Likelihood,
        x4_likelihood: x4Likelihood,
      } = para;

      let moveAction: ReturnType<typeof move> | undefined;
      let giveUpAction: ReturnType<typeof giveUp> | undefined;
      let guessAction: ReturnType<typeof guess> | undefined;
      let skipGuessAction: ReturnType<typeof skipGuess> | undefined;
      let loadNextBonusAction: ReturnType<typeof loadNextBonus> | undefined;
      let pickAction: ReturnType<typeof pick> | undefined;
      let submitDetailsAction: ReturnType<typeof submitDetails> | undefined;

      // Encompasses a single episode. Exiting from the loop will result in a new episode if any.
      do {
        let displayResult = yield* call(
          handleDisplayUpdate,
          episodeId,
          playerId,
          para,
          isCurrentGameCoop,
          isCurrentGameAdve,
        );

        if (displayResult.finishCode === FinishCode.GIVEN_UP) {
          break;
        }

        // This will help the other client wait for the current client to finish their win streak
        while (displayResult.mustWait) {
          // Listen for messages and process them:
          if (socketChannel) {
            // Listen for messages and process them:
            yield* processMessages(socketChannel);
          }

          // Once READY DIS is received, update the display
          displayResult = yield call(
            handleDisplayUpdate,
            episodeId,
            playerId,
            para,
            isCurrentGameCoop,
            isCurrentGameAdve,
          );
        }

        ({
          moveAction,
          giveUpAction,
          guessAction,
          skipGuessAction,
          loadNextBonusAction,
          pickAction,
          submitDetailsAction,
        } = yield* race({
          moveAction: takeAction(move),
          giveUpAction: takeAction(giveUp),
          guessAction: takeAction(guess),
          skipGuessAction: takeAction(skipGuess),
          loadNextBonusAction: takeAction(loadNextBonus),
          pickAction: takeAction(pick),
          submitDetailsAction: takeAction(submitDetails),
        }));

        if (moveAction) {
          const boardObject = displayResult.board.value.find(
            // eslint-disable-next-line no-loop-func
            (boardObject) => boardObject.id === moveAction!.payload.boardObjectId,
          )!;

          yield* put(pause());

          const {
            data: { code, error, errmsg, mustWait, botAssistChat },
          } = yield* apiResolve(
            '/game-data/GameService2/move',
            METHOD.POST,
            {
              episode: episodeId,
              x: boardObject.x,
              bx: boardPositionToBxBy[moveAction.payload.bucket].bx,
              by: boardPositionToBxBy[moveAction.payload.bucket].by,
              y: boardObject.y,
              cnt: displayResult.numMovesMade,
              playerId: playerId,
            },
            {},
          );

          // Cannot tell if errmsg is a real error or just debug info
          // Would be easy to know whether there is an error flag in the /move response.
          if (error) {
            throw Error(`Error on /move: ${errmsg}`);
          }

          if (code === Code.ACCEPT) {
            yield* put(validMove(moveAction.payload.boardObjectId, moveAction.payload.bucket));
          } else if (code === Code.DENY || code === Code.IMMOVABLE) {
            yield* put(invalidMove(moveAction.payload.boardObjectId, moveAction.payload.bucket));
          }

          if (botAssistChat) {
            yield* put(addMessage('ASSISTANT: ', botAssistChat));
          }
          yield* delay(FEEDBACK_DURATION);
          // if (mustWait) {
          //   yield call(ws.waitForReadyDis);
          //   yield* put(addMessage('READY DIS'));
          //   // displayResult = yield* call(handleDisplayUpdate, episodeId, playerId, para);
          //   continue;
          // }
        } else if (pickAction) {
          const boardObject = display.board.value.find(
            // eslint-disable-next-line no-loop-func
            (boardObject) => boardObject.id === pickAction!.payload.boardObjectId,
          )!;

          const {
            data: { errmsg, error, mustWait, botAssistChat },
          } = yield* apiResolve(
            '/game-data/GameService2/pick',
            METHOD.POST,
            {
              episode: episodeId,
              x: boardObject.x,
              y: boardObject.y,
              id: boardObject.id,
              cnt: displayResult.numMovesMade,
              playerId: playerId,
            },
            {},
          );

          // Cannot tell if errmsg is a real error or just debug info
          // Would be easy to know whether there is an error flag in the /pick response.
          if (error) {
            throw Error(`Error on /pick: ${errmsg}`);
          }

          if (botAssistChat) {
            yield* put(addMessage('ASSISTANT: ', botAssistChat));
          }

          // if (mustWait) {
          //   yield call(ws.waitForReadyDis);
          //   yield* put(addMessage('READY DIS'));
          //   // displayResult = yield* call(handleDisplayUpdate, episodeId, playerId, para);
          //   continue;
          // }
        } else if (giveUpAction) {
          const {
            data: { error, errmsg },
          } = yield* apiResolve(
            '/game-data/GameService2/giveUp',
            METHOD.POST,
            { playerId, seriesNo: display.seriesNo },
            {},
          );
          if (error) {
            throw Error(`Error on /giveUp: ${errmsg}`);
          }
        } else if (guessAction) {
          const {
            data: { error, errmsg },
          } = yield* apiResolve(
            '/game-data/GameService2/guess',
            METHOD.POST,
            {
              episode: episodeId,
              data: guessAction.payload.data,
              confidence: guessAction.payload.confidence,
              playerId,
            },
            {},
          );

          if (error) {
            throw Error(`Error on /guess: ${errmsg}`);
          }
        } else if (submitDetailsAction) {
          const { how, idea } = submitDetailsAction.payload;
          const {
            data: { error, errmsg },
          } = yield* apiResolve(
            '/game-data/GameService2/guess',
            METHOD.POST,
            {
              episode: episodeId,
              data: `How:\n${how}\nIdea:\n${idea}`,
              confidence: -1,
              playerId,
            },
            {},
          );

          if (error) {
            throw Error(`Error on /guess: ${errmsg}`);
          }
        }
      } while (
        !submitDetailsAction &&
        !giveUpAction &&
        !guessAction &&
        !skipGuessAction &&
        !loadNextBonusAction
      );

      ({
        data: { alreadyFinished, episodeId, para, errmsg, error },
      } = yield* apiResolve('/game-data/GameService2/newEpisode', METHOD.POST, { playerId }, {}));

      if (para) yield* put(setIsBotAssisted(para.bot_assist ?? ''));
      if (alreadyFinished !== true && error) {
        throw Error(`Error on /newEpisode: ${errmsg}`);
      }
    }

    yield* put(nextPage());

    const {
      payload: { data: demographics },
    } = yield* takeAction(recordDemographics);

    // Process matrix-game specially
    const demographicsProcessedData = merge(demographics, demographics['matrix-games']);
    delete demographicsProcessedData['matrix-games'];

    const csvString = Papa.unparse({
      fields: ['key', 'value'],
      data: Object.entries(demographics),
    });

    yield* apiResolve(
      '/game-data/GameService/writeFile',
      METHOD.POST,
      {
        data: csvString,
        dir: 'demographics',
        file: `${playerId}.csv`,
      },
      {},
    );

    yield* put(nextPage());
  } catch (e) {
    if (e instanceof Error) {
      yield* put(addLayer('An Error Ocurred', e.message, []));
      throw e;
    }
  }
}

// TODO: Set data type of para
function* handleDisplayUpdate(
  episodeId: string,
  playerId: string,
  para: any,
  isCurrentGameCoop: boolean,
  isCurrentGameAdve: boolean,
) {
  const { data: display } = yield* apiResolve(
    '/game-data/GameService2/display',
    METHOD.GET,
    undefined,
    {
      episode: episodeId,
      playerId: playerId,
    },
  );

  // TODO: This code won't affect the two player game as there is no way to give up in it
  if (display.finishCode === FinishCode.GIVEN_UP) {
    // Exit current episode and retrieve a new episode if any.
    return display;
  }

  // TODO: Temporarily allow the player to clear the board after the factorPromised is at 4.
  // Eventually, disallow it to continue once the API can auto complete the board.
  // if (display.factorPromised !== 4) {
  yield* put(unpause());
  // }
  const boardPayload = {
    board: display.board.value,
    bonus: display.bonus,
    bonusEpisodeNo: display.bonusEpisodeNo,
    canActivateBonus: display.canActivateBonus,
    finishCode: display.finishCode,
    totalRewardEarned: display.totalRewardEarned,
    totalRewardEarnedPartner: display.totalRewardEarnedPartner,
    totalBoardsPredicted: display.totalBoardsPredicted,
    stackMemoryDepth: para.stack_memory_depth,
    showGridMemoryOrder: para.grid_memory_show_order,
    showStackMemoryOrder: para.stack_memory_show_order,
    seriesNo: display.seriesNo,
    transcript: display.transcript,
    rulesSrc: display.rulesSrc,
    ruleLineNo: display.ruleLineNo,
    numMovesMade: display.numMovesMade,
    episodeNo: display.episodeNo,
    episodeId,
    maxPoints: para.max_points,
    feedbackSwitches: para.feedback_switches,
    ruleSetName: display.ruleSetName,
    trialListId: display.trialListId,
    movesLeftToStayInBonus: display.movesLeftToStayInBonus,
    transitionMap: display.transitionMap,
    giveUpAt: para.give_up_at,
    incentive: display.incentive,
    lastStretch: display.lastStretch,
    lastR: display.lastR,
    rewardsAndFactorsPerSeries: display.rewardsAndFactorsPerSeries,
    factorAchieved: display.factorAchieved,
    factorPromised: display.factorPromised,
    justReachedX2: display.justReachedX2,
    justReachedX4: display.justReachedX4,
    x2After: para.x2_after,
    x4After: para.x4_after,
    x2Likelihood: para.x2_likelihood,
    x4Likelihood: para.x4_likelihood,
    // TODO: Temporarily allow the player to clear the board after the factorPromised is at 4.
    // Eventually, disallow it to continue once the API can auto complete the board.
    // if (display.factorPromised !== 4) {
    // isPaused: display.factorPromised === 4,
    isPaused: false,
    isPlayerTurn: display.mustWait ? false : true,
    twoPGCoop: isCurrentGameCoop,
    twoPGAdve: isCurrentGameAdve,
    faces: display.faces,
    facesMine: display.facesMine,
    displayEpisodeNo: display.displayEpisodeNo,
    displaySeriesNo: display.displaySeriesNo,
  };

  yield* put(setBoard(boardPayload));

  return display;
}

function* activateBonusSaga() {
  const workerId = (yield* select(workerIdSelector))!;
  yield* apiResolve(
    '/game-data/GameService2/activateBonus',
    METHOD.POST,
    { playerId: workerId },
    {},
  );
}

export default function* () {
  const {
    payload: { playerId, exp, uid },
  } = yield* takeAction(startTrials);
  yield* takeEvery(getType(activateBonus), activateBonusSaga);
  yield* call(trials, playerId, exp, uid);
}
