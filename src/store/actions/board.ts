import { createAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import {
  Board,
  FeedbackSwitches,
  FinishCode,
  Incentive,
  Transcript,
  TransitionMap,
} from '../../utils/api';
// eslint-disable-next-line import/no-cycle
import { BucketPosition } from '../../constants/BucketPosition';

export const startTrials = createAction(
  'board/START_TRIALS',
  ({ uid, playerId, exp }: { uid?: number; playerId?: string; exp?: string }) => ({
    uid,
    playerId,
    exp,
  }),
)();

// TODO:  Check if both player ids are required
export const start2PTrials = createAction(
  'board/START_2P_TRIALS',
  ({ uid, playerId, exp }: { uid?: number; playerId?: string; exp?: string }) => ({
    uid,
    playerId,
    exp,
  }),
)();

export const setBoard = createAction(
  'board/SET_BOARD',
  ({
    board,
    bonus,
    bonusEpisodeNo,
    canActivateBonus,
    finishCode,
    totalRewardEarned,
    totalRewardEarnedPartner,
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
    episodeId,
    maxPoints,
    feedbackSwitches,
    ruleSetName,
    trialListId,
    movesLeftToStayInBonus,
    transitionMap,
    giveUpAt,
    incentive,
    lastStretch,
    lastR,
    rewardsAndFactorsPerSeries,
    factorAchieved,
    factorPromised,
    justReachedX2,
    justReachedX4,
    x2After,
    x4After,
    x2Likelihood,
    x4Likelihood,
    isPaused = false,
    isPlayerTurn,
    twoPGCoop,
    twoPGAdve,
    faces,
    facesMine,
    displaySeriesNo,
    displayEpisodeNo,
  }: {
    board: Board;
    bonus: boolean;
    bonusEpisodeNo: number;
    canActivateBonus: boolean;
    finishCode: FinishCode;
    totalRewardEarned: number;
    totalRewardEarnedPartner: number;
    totalBoardsPredicted: number;
    showGridMemoryOrder: boolean;
    showStackMemoryOrder: boolean;
    stackMemoryDepth: number;
    seriesNo: number;
    transcript: Transcript;
    rulesSrc: {
      orders: number[];
      rows: string[];
    };
    ruleLineNo: number;
    numMovesMade: number;
    episodeNo: number;
    episodeId: string;
    maxPoints: number;
    feedbackSwitches: FeedbackSwitches;
    ruleSetName: string;
    trialListId: string;
    movesLeftToStayInBonus?: number;
    transitionMap?: TransitionMap;
    giveUpAt?: number;
    incentive?: Incentive;
    lastStretch: number;
    lastR: number;
    rewardsAndFactorsPerSeries: [number, number][];
    factorAchieved?: number;
    factorPromised?: number;
    justReachedX2?: boolean;
    justReachedX4?: boolean;
    x2After?: number;
    x4After?: number;
    x2Likelihood?: number;
    x4Likelihood?: number;
    isPaused?: boolean;
    isPlayerTurn: boolean;
    twoPGCoop: boolean;
    twoPGAdve: boolean;
    faces?: boolean[];
    facesMine?: boolean[];
    displaySeriesNo: number;
    displayEpisodeNo: number;
  }) => ({
    board,
    bonus,
    bonusEpisodeNo,
    canActivateBonus,
    finishCode,
    totalRewardEarned,
    totalRewardEarnedPartner,
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
    giveUpAt,
    feedbackSwitches,
    ruleSetName,
    trialListId,
    incentive,
    lastStretch,
    lastR,
    rewardsAndFactorsPerSeries,
    factorAchieved,
    factorPromised,
    justReachedX2,
    justReachedX4,
    x2After,
    x4After,
    x2Likelihood,
    x4Likelihood,
    isPaused,
    isPlayerTurn,
    twoPGCoop,
    twoPGAdve,
    faces,
    facesMine,
    displaySeriesNo,
    displayEpisodeNo,
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

export const recordDemographics = createAction(
  'board/RECORD_DEMOGRAPHICS',
  (data: Record<string, unknown>) => ({
    data,
  }),
)();

export const pick = createAction('board/PICK', (boardObjectId: number) => ({
  boardObjectId,
}))();

export const setWorkerId = createAction('board/SET_WORKER_ID', (workerId?: string) => ({
  workerId,
}))();

export const submitDetails = createAction('board/SUBMIT_DETAILS', (idea: string, how: string) => ({
  idea,
  how,
}))();
