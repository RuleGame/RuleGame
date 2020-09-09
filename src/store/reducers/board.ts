import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { Board, Code } from '../../utils/api';
import { invalidMove, pause, setBoard, unpause, validMove } from '../actions/board';
import { BucketPosition } from '../../constants/BucketPosition';
import { Shape } from '../../constants/Shape';

export type State = {
  board: Board;
  bonus: boolean;
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
};

export const initialState: State = {
  board: [],
  bonus: false,
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
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(setBoard):
      return {
        ...state,
        board: action.payload.board,
        bonus: action.payload.bonus,
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
