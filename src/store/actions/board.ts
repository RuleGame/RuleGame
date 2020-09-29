import { createAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { Board, FinishCode, Transcript, TransitionMap } from '../../utils/api';
// eslint-disable-next-line import/no-cycle
import { BucketPosition } from '../../constants/BucketPosition';

export const startTrials = createAction('board/START_TRIALS', (playerId: string, exp?: string) => ({
  playerId,
  exp,
}))();

export const setBoard = createAction(
  'board/SET_BOARD',
  (
    board: Board,
    bonus: boolean,
    bonusEpisodeNo: number,
    canActivateBonus: boolean,
    finishCode: FinishCode,
    totalRewardEarned: number,
    totalBoardsPredicted: number,
    showGridMemoryOrder: boolean,
    showStackMemoryOrder: boolean,
    stackMemoryDepth: number,
    seriesNo: number,
    transcript: Transcript,
    rulesSrc: {
      orders: number[];
      rows: string[];
    },
    ruleLineNo: number,
    numMovesMade: number,
    episodeNo: number,
    episodeId: string,
    maxPoints: number,
    movesLeftToStayInBonus?: number,
    transitionMap?: TransitionMap,
  ) => ({
    board,
    bonus,
    bonusEpisodeNo,
    canActivateBonus,
    finishCode,
    totalRewardEarned,
    totalBoardsPredicted,
    showGridMemoryOrder,
    showStackMemoryOrder,
    stackMemoryDepth,
    seriesNo,
    transcript,
    rulesSrc,
    ruleLineNo,
    numMovesMade,
    episodeNo,
    movesLeftToStayInBonus,
    transitionMap,
    episodeId,
    maxPoints,
  }),
)();

export const pause = createAction('board/PAUSE')();

export const unpause = createAction('board/UNPAUSE')();

export const move = createAction('board/MOVE', (boardObjectId: number, bucket: BucketPosition) => ({
  boardObjectId,
  bucket,
}))();

export const activateBonus = createAction('board/ACTIVATE_BONUS')();

export const giveUp = createAction('board/GIVE_UP')();

export const guess = createAction('board/GUESS', (data: string, confidence: number) => ({
  data,
  confidence,
}))();

export const validMove = createAction(
  'board/VALID_MOVE',
  (boardObjectId: number, bucket: BucketPosition) => ({
    boardObjectId,
    bucket,
  }),
)();

export const invalidMove = createAction(
  'board/INVALID_MOVE',
  (boardObjectId: number, bucket: BucketPosition) => ({
    boardObjectId,
    bucket,
  }),
)();

export const skipGuess = createAction('board/NEXT')();

export const loadNextBonus = createAction('board/LOAD_NEXT_BONUS')();

export const setIsInBonus = createAction('board/SET_IS_IN_BONUS', (isInBonus: boolean) => ({
  isInBonus,
}))();

export const recordDemographics = createAction('board/RECORD_DEMOGRAPHICS', (data: object) => ({
  data,
}))();
