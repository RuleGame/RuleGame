import { call, delay, put, race, select, takeEvery } from 'typed-redux-saga';
import { getType } from 'typesafe-actions';
import Papa from 'papaparse';
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
  unpause,
  validMove,
} from '../actions/board';
import { nextPage } from '../actions/page';
import { boardPositionToBxBy, FEEDBACK_DURATION } from '../../constants';
import { apiResolve, takeAction } from './utils/helpers';
import { addLayer } from '../actions/layers';
import { workerIdSelector } from '../selectors/board';

function* trials(playerId?: string, exp?: string, uid?: number) {
  try {
    const {
      data: { error: playerError, errmsg: playerErrmsg, playerId: playerIdResponse },
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
    if (noEpisodeStarted) {
      const { data: newEpisodeData } = yield* apiResolve(
        '/game-data/GameService2/newEpisode',
        METHOD.POST,
        { playerId },
        {},
      );

      data = newEpisodeData;

      if (newEpisodeData.error) {
        throw Error(`Error on /newEpisdoe: ${newEpisodeData.errmsg}`);
      }
    } else if (error) {
      throw Error(`Error on /mostRecentEpisode ${errmsg}`);
    }

    let { alreadyFinished, episodeId, para } = data;

    yield* put(nextPage());

    while (!alreadyFinished) {
      const {
        grid_memory_show_order: gridMemoryShowOrder,
        stack_memory_show_order: stackMemoryShowOrder,
        stack_memory_depth: stackMemoryDepth,
        give_up_at: giveUpAt,
        feedback_switches: feedbackSwitches,
      } = para;

      let moveAction: ReturnType<typeof move> | undefined;
      let giveUpAction: ReturnType<typeof giveUp> | undefined;
      let guessAction: ReturnType<typeof guess> | undefined;
      let skipGuessAction: ReturnType<typeof skipGuess> | undefined;
      let loadNextBonusAction: ReturnType<typeof loadNextBonus> | undefined;
      let pickAction: ReturnType<typeof pick> | undefined;

      // Encompasses a single episode. Exiting from the loop will result in a new episode if any.
      do {
        const { data: display } = yield* apiResolve(
          '/game-data/GameService2/display',
          METHOD.GET,
          undefined,
          {
            episode: episodeId,
          },
        );

        if (display.finishCode === FinishCode.GIVEN_UP) {
          // Exit current episode and retrieve a new episode if any.
          break;
        }

        yield* put(unpause());

        yield* put(
          setBoard(
            display.board.value,
            display.bonus,
            display.bonusEpisodeNo,
            display.canActivateBonus,
            display.finishCode,
            display.totalRewardEarned,
            display.totalBoardsPredicted,
            gridMemoryShowOrder,
            stackMemoryShowOrder,
            stackMemoryDepth,
            display.seriesNo,
            display.transcript,
            display.rulesSrc,
            display.ruleLineNo,
            display.numMovesMade,
            display.episodeNo,
            episodeId,
            para.max_points,
            feedbackSwitches,
            display.ruleSetName,
            display.trialListId,
            display.movesLeftToStayInBonus,
            display.transitionMap,
            giveUpAt,
          ),
        );

        ({
          moveAction,
          giveUpAction,
          guessAction,
          skipGuessAction,
          loadNextBonusAction,
          pickAction,
        } = yield* race({
          moveAction: takeAction(move),
          giveUpAction: takeAction(giveUp),
          guessAction: takeAction(guess),
          skipGuessAction: takeAction(skipGuess),
          loadNextBonusAction: takeAction(loadNextBonus),
          pickAction: takeAction(pick),
        }));

        if (moveAction) {
          const boardObject = display.board.value.find(
            // eslint-disable-next-line no-loop-func
            (boardObject) => boardObject.id === moveAction!.payload.boardObjectId,
          )!;

          yield* put(pause());

          const {
            data: { code, error, errmsg },
          } = yield* apiResolve(
            '/game-data/GameService2/move',
            METHOD.POST,
            {
              episode: episodeId,
              x: boardObject.x,
              bx: boardPositionToBxBy[moveAction.payload.bucket].bx,
              by: boardPositionToBxBy[moveAction.payload.bucket].by,
              y: boardObject.y,
              cnt: display.numMovesMade,
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
          } else if (code === Code.DENY) {
            yield* put(invalidMove(moveAction.payload.boardObjectId, moveAction.payload.bucket));
          }

          yield* delay(FEEDBACK_DURATION);
        } else if (pickAction) {
          const boardObject = display.board.value.find(
            // eslint-disable-next-line no-loop-func
            (boardObject) => boardObject.id === pickAction!.payload.boardObjectId,
          )!;

          const {
            data: { errmsg, error },
          } = yield* apiResolve(
            '/game-data/GameService2/pick',
            METHOD.POST,
            {
              episode: episodeId,
              x: boardObject.x,
              y: boardObject.y,
              cnt: display.numMovesMade,
            },
            {},
          );

          // Cannot tell if errmsg is a real error or just debug info
          // Would be easy to know whether there is an error flag in the /pick response.
          if (error) {
            throw Error(`Error on /pick: ${errmsg}`);
          }
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
            },
            {},
          );

          if (error) {
            throw Error(`Error on /guess: ${errmsg}`);
          }
        }
      } while (!giveUpAction && !guessAction && !skipGuessAction && !loadNextBonusAction);

      ({
        data: { alreadyFinished, episodeId, para, errmsg, error },
      } = yield* apiResolve('/game-data/GameService2/newEpisode', METHOD.POST, { playerId }, {}));

      if (error) {
        throw Error(`Error on /newEpisode: ${errmsg}`);
      }
    }

    yield* put(nextPage());

    const {
      payload: { data: demographics },
    } = yield* takeAction(recordDemographics);

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
    }
  }
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
