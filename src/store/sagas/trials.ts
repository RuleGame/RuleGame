import { call, delay, put, race, takeEvery } from 'typed-redux-saga';
import { getType } from 'typesafe-actions';
import Papa from 'papaparse';
import { Code, ErrorMsg, METHOD } from '../../utils/api';
import {
  activateBonus,
  giveUp,
  guess,
  invalidMove,
  loadNextBonus,
  move,
  recordDemographics,
  setBoard,
  skipGuess,
  startTrials,
  validMove,
} from '../actions/board';
import { nextPage } from '../actions/page';
import { boardPositionToBxBy, FEEDBACK_DURATION } from '../../constants';
import { apiResolve, takeAction } from './utils/helpers';

function* trials(playerId: string, exp?: string) {
  yield* apiResolve('/w2020/game-data/GameService2/player', METHOD.POST, { playerId, exp }, {});

  let {
    // eslint-disable-next-line prefer-const
    data: { errmsg, error, ...data },
  } = yield* apiResolve(
    '/w2020/game-data/GameService2/mostRecentEpisode',
    METHOD.POST,
    { playerId },
    {},
  );

  const noEpisodeStarted = error && errmsg === ErrorMsg.FAILED_TO_FIND_ANY_EPISODE;
  if (noEpisodeStarted) {
    ({ data } = yield* apiResolve(
      '/w2020/game-data/GameService2/newEpisode',
      METHOD.POST,
      { playerId },
      {},
    ));
  }

  let { alreadyFinished, episodeId, para } = data;

  yield* put(nextPage());

  while (!alreadyFinished) {
    const {
      grid_memory_show_order: gridMemoryShowOrder,
      stack_memory_show_order: stackMemoryShowOrder,
      stack_memory_depth: stackMemoryDepth,
    } = para;

    let moveAction: ReturnType<typeof move> | undefined;
    let giveUpAction: ReturnType<typeof giveUp> | undefined;
    let guessAction: ReturnType<typeof guess> | undefined;
    let skipGuessAction: ReturnType<typeof skipGuess> | undefined;
    let loadNextBonusAction: ReturnType<typeof loadNextBonus> | undefined;

    do {
      const { data: display } = yield* apiResolve(
        '/w2020/game-data/GameService2/display',
        METHOD.GET,
        undefined,
        {
          episode: episodeId,
        },
      );

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
          display.movesLeftToStayInBonus,
          display.transitionMap,
        ),
      );

      ({
        moveAction,
        giveUpAction,
        guessAction,
        skipGuessAction,
        loadNextBonusAction,
      } = yield* race({
        moveAction: takeAction(move),
        giveUpAction: takeAction(giveUp),
        guessAction: takeAction(guess),
        skipGuessAction: takeAction(skipGuess),
        loadNextBonusAction: takeAction(loadNextBonus),
      }));

      if (moveAction) {
        const boardObject = display.board.value.find(
          // eslint-disable-next-line no-loop-func
          (boardObject) => boardObject.id === moveAction!.payload.boardObjectId,
        )!;

        const {
          data: { code },
        } = yield* apiResolve(
          '/w2020/game-data/GameService2/move',
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

        if (code === Code.ACCEPT) {
          yield* put(validMove(moveAction.payload.boardObjectId, moveAction.payload.bucket));
        } else if (code === Code.DENY) {
          yield* put(invalidMove(moveAction.payload.boardObjectId, moveAction.payload.bucket));
        }

        yield* delay(FEEDBACK_DURATION);
      } else if (giveUpAction) {
        yield* apiResolve(
          '/w2020/game-data/GameService2/giveUp',
          METHOD.POST,
          { playerId, seriesNo: display.seriesNo },
          {},
        );
      } else if (guessAction) {
        yield* apiResolve(
          '/w2020/game-data/GameService2/guess',
          METHOD.POST,
          { episode: episodeId, data: guessAction.payload.data },
          {},
        );
      }
    } while (!giveUpAction && !guessAction && !skipGuessAction && !loadNextBonusAction);

    ({
      data: { alreadyFinished, episodeId, para },
    } = yield* apiResolve(
      '/w2020/game-data/GameService2/newEpisode',
      METHOD.POST,
      { playerId },
      {},
    ));
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
    '/w2020/game-data/GameService/writeFile',
    METHOD.POST,
    {
      data: csvString,
      dir: 'demographics',
      file: `${playerId}.csv`,
    },
    {},
  );

  yield* put(nextPage());
}

function* activateBonusSaga(playerId: string) {
  yield* apiResolve('/w2020/game-data/GameService2/activateBonus', METHOD.POST, { playerId }, {});
}

export default function* () {
  const {
    payload: { playerId, exp },
  } = yield* takeAction(startTrials);
  yield* takeEvery(getType(activateBonus), activateBonusSaga, playerId);
  yield* call(trials, playerId, exp);
}
