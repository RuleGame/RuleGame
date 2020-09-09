import { call, delay, put, race } from 'typed-redux-saga';
import { Code, ErrorMsg, METHOD } from '../../utils/api';
import {
  activateBonus,
  giveUp,
  guess,
  invalidMove,
  move,
  setBoard,
  startTrials,
  validMove,
} from '../actions/board';
import { goToPage } from '../actions/page';
import { boardPositionToBxBy, FEEDBACK_DURATION } from '../../constants';
import { Page } from '../../constants/Page';
import { apiResolve, takeAction } from './utils/helpers';

function* trials(playerId: string) {
  yield* apiResolve('/w2020/game-data/GameService2/player', METHOD.POST, { playerId }, {});

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

  yield* put(goToPage(Page.TRIALS));

  while (!alreadyFinished) {
    const {
      grid_memory_show_order: gridMemoryShowOrder,
      stack_memory_show_order: stackMemoryShowOrder,
      stack_memory_depth: stackMemoryDepth,
    } = para;

    let moveAction: ReturnType<typeof move> | undefined;
    let activateBonusAction: ReturnType<typeof activateBonus> | undefined;
    let giveUpAction: ReturnType<typeof giveUp> | undefined;
    let guessAction: ReturnType<typeof guess> | undefined;

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
        ),
      );

      ({ moveAction, activateBonusAction, giveUpAction, guessAction } = yield* race({
        moveAction: takeAction(move),
        activateBonusAction: takeAction(activateBonus),
        giveUpAction: takeAction(giveUp),
        guessAction: takeAction(guess),
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
      }
      if (activateBonusAction) {
        yield* apiResolve(
          '/w2020/game-data/GameService2/activateBonus',
          METHOD.POST,
          { playerId },
          {},
        );
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
    } while (activateBonusAction || giveUpAction || guessAction);

    ({
      data: { alreadyFinished, episodeId, para },
    } = yield* apiResolve(
      '/w2020/game-data/GameService2/newEpisode',
      METHOD.POST,
      { playerId },
      {},
    ));
  }

  // 6.Proceed to end of game
  yield* put(goToPage(Page.DEMOGRAPHICS_INSTRUCTIONS));
}

export default function* () {
  const {
    payload: { playerId },
  } = yield* takeAction(startTrials);
  yield* call(trials, playerId);
}
