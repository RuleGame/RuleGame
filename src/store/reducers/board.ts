import { getType } from 'typesafe-actions';
import { SpecialShape } from '../../constants';
import { BucketPosition } from '../../constants/BucketPosition';
import { Shape } from '../../constants/Shape';
import {
  BoardObject,
  FeedbackSwitches,
  FinishCode,
  Incentive,
  Transcript,
  TransitionMap,
} from '../../utils/api';
import { RootAction } from '../actions';
import {
  invalidMove,
  pause,
  setBoard,
  setIsInBonus,
  setWorkerId,
  unpause,
  validMove,
} from '../actions/board';

export type State = {
  workerId?: string;
  board: { [boardObjectId: number]: BoardObject };
  isInBonus: boolean;
  bonusEpisodeNo: number;
  canActivateBonus: boolean;
  finishCode: FinishCode;
  totalRewardEarned: number;
  totalBoardsPredicted: number;
  showGridMemoryOrder: boolean;
  showStackMemoryOrder: boolean;
  bucketShapes: { [bucket in BucketPosition]: Shape };
  isPaused: boolean;
  seriesNo: number;
  transcript: Transcript;
  rulesSrc: {
    orders: number[];
    rows: string[];
  };
  ruleLineNo?: number;
  numMovesMade: number;
  episodeNo: number;
  stackMemoryDepth: number;
  movesLeftToStayInBonus?: number;
  transitionMap?: TransitionMap;
  episodeId: string;
  maxPoints: number;
  giveUpAt?: number;
  feedbackSwitches: FeedbackSwitches;
  ruleSetName: string;
  trialListId: string;
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
  faces?: boolean[];
  displaySeriesNo: number;
  displayEpisodeNo: number;
};

export const initialState: State = {
  workerId: undefined,
  board: {},
  isInBonus: false,
  bonusEpisodeNo: 0,
  canActivateBonus: false,
  finishCode: FinishCode.NO,
  totalRewardEarned: 0,
  totalBoardsPredicted: 0,
  showGridMemoryOrder: false,
  showStackMemoryOrder: false,
  bucketShapes: {
    [BucketPosition.BL]: SpecialShape.BUCKET,
    [BucketPosition.BR]: SpecialShape.BUCKET,
    [BucketPosition.TR]: SpecialShape.BUCKET,
    [BucketPosition.TL]: SpecialShape.BUCKET,
  },
  isPaused: false,
  seriesNo: 0,
  transcript: [],
  rulesSrc: {
    orders: [],
    rows: [],
  },
  ruleLineNo: undefined,
  numMovesMade: 0,
  episodeNo: 0,
  stackMemoryDepth: 0,
  movesLeftToStayInBonus: undefined,
  transitionMap: undefined,
  episodeId: 'N/A',
  maxPoints: 0,
  feedbackSwitches: FeedbackSwitches.FIXED,
  ruleSetName: 'N/A',
  trialListId: 'N/A',
  incentive: undefined,
  lastStretch: 0,
  lastR: 0,
  rewardsAndFactorsPerSeries: [],
  factorAchieved: undefined,
  factorPromised: undefined,
  justReachedX2: undefined,
  justReachedX4: undefined,
  x2After: undefined,
  x4After: undefined,
  x2Likelihood: undefined,
  x4Likelihood: undefined,
  faces: [],
  displaySeriesNo: 0,
  displayEpisodeNo: 0,
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(setBoard):
      return {
        ...state,
        board: action.payload.board.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.id]: curr,
          }),
          {},
        ),
        isInBonus: action.payload.bonus,
        bonusEpisodeNo: action.payload.bonusEpisodeNo,
        canActivateBonus: action.payload.canActivateBonus,
        finishCode: action.payload.finishCode,
        totalRewardEarned: action.payload.totalRewardEarned,
        totalBoardsPredicted: action.payload.totalBoardsPredicted,
        showGridMemoryOrder: action.payload.showGridMemoryOrder,
        showStackMemoryOrder: action.payload.showStackMemoryOrder,
        isPaused: action.payload.isPaused,
        bucketShapes: {
          [BucketPosition.BL]: SpecialShape.BUCKET,
          [BucketPosition.BR]: SpecialShape.BUCKET,
          [BucketPosition.TR]: SpecialShape.BUCKET,
          [BucketPosition.TL]: SpecialShape.BUCKET,
        },
        // Shouldn't take a huge performance hit updating transcript
        // for every move. Transcript should be small enough to filter
        // for each 4 bucket drop list.
        transcript: action.payload.transcript,
        rulesSrc: action.payload.rulesSrc,
        ruleLineNo: action.payload.ruleLineNo,
        numMovesMade: action.payload.numMovesMade,
        episodeNo: action.payload.episodeNo,
        stackMemoryDepth: action.payload.stackMemoryDepth,
        seriesNo: action.payload.seriesNo,
        movesLeftToStayInBonus: action.payload.movesLeftToStayInBonus,
        transitionMap: action.payload.transitionMap,
        episodeId: action.payload.episodeId,
        maxPoints: action.payload.maxPoints,
        giveUpAt: action.payload.giveUpAt,
        feedbackSwitches: action.payload.feedbackSwitches,
        ruleSetName: action.payload.ruleSetName,
        trialListId: action.payload.trialListId,
        incentive: action.payload.incentive,
        lastStretch: action.payload.lastStretch,
        lastR: action.payload.lastR,
        rewardsAndFactorsPerSeries: action.payload.rewardsAndFactorsPerSeries,
        factorAchieved: action.payload.factorAchieved,
        factorPromised: action.payload.factorPromised,
        justReachedX2: action.payload.justReachedX2,
        justReachedX4: action.payload.justReachedX4,
        x2After: action.payload.x2After,
        x4After: action.payload.x4After,
        x2Likelihood: action.payload.x2Likelihood,
        x4Likelihood: action.payload.x4Likelihood,
        faces: action.payload.faces,
        displaySeriesNo: action.payload.displaySeriesNo,
        displayEpisodeNo: action.payload.displayEpisodeNo,
      };

    case getType(pause):
      return {
        ...state,
        isPaused: true,
      };

    case getType(unpause):
      return {
        ...state,
        isPaused: false,
      };

    case getType(validMove):
      return {
        ...state,
        isPaused: true,
        bucketShapes: {
          ...state.bucketShapes,
          [action.payload.bucket]: SpecialShape.HAPPY,
        },
      };

    case getType(invalidMove):
      return {
        ...state,
        isPaused: true,
        bucketShapes: {
          ...state.bucketShapes,
          [action.payload.bucket]: SpecialShape.UNHAPPY,
        },
      };

    case getType(setIsInBonus):
      return {
        ...state,
        isInBonus: action.payload.isInBonus,
      };

    case getType(setWorkerId):
      return {
        ...state,
        workerId: action.payload.workerId,
      };

    default:
      return state;
  }
};

export default reducer;
