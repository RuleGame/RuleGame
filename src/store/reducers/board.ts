import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { BoardObject, Code, Transcript } from '../../utils/api';
import { invalidMove, pause, setBoard, unpause, validMove } from '../actions/board';
import { BucketPosition } from '../../constants/BucketPosition';
import { Shape } from '../../constants/Shape';

export type State = {
  board: { [boardObjectId: number]: BoardObject };
  isInBonus: boolean;
  bonusEpisodeNo: number;
  canActivateBonus: boolean;
  finishCode: Code;
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
  numMovesLeft?: number;
  stackMemoryDepth: number;
};

export const initialState: State = {
  board: {},
  isInBonus: false,
  bonusEpisodeNo: 0,
  canActivateBonus: false,
  finishCode: Code.NO_GAME,
  totalRewardEarned: 0,
  totalBoardsPredicted: 0,
  showGridMemoryOrder: false,
  showStackMemoryOrder: false,
  bucketShapes: {
    [BucketPosition.BL]: Shape.BUCKET,
    [BucketPosition.BR]: Shape.BUCKET,
    [BucketPosition.TR]: Shape.BUCKET,
    [BucketPosition.TL]: Shape.BUCKET,
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
  numMovesLeft: undefined,
  stackMemoryDepth: 0,
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
        isPaused: false,
        bucketShapes: {
          [BucketPosition.BL]: Shape.BUCKET,
          [BucketPosition.BR]: Shape.BUCKET,
          [BucketPosition.TR]: Shape.BUCKET,
          [BucketPosition.TL]: Shape.BUCKET,
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
          [action.payload.bucket]: Shape.HAPPY,
        },
      };

    case getType(invalidMove):
      return {
        ...state,
        isPaused: true,
        bucketShapes: {
          ...state.bucketShapes,
          [action.payload.bucket]: Shape.UNHAPPY,
        },
      };

    default:
      return state;
  }
};

export default reducer;
