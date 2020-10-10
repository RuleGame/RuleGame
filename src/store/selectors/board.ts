import { RootState } from '../reducers';
import { BoardObject, Code, FinishCode } from '../../utils/api';
import { BucketPosition } from '../../constants/BucketPosition';

export const isPausedSelector = (state: RootState) => state.board.isPaused;

export const bucketShapesSelector = (state: RootState) => state.board.bucketShapes;

export const seriesNoSelector = (state: RootState) => state.board.seriesNo;

export const isGameCompletedSelector = (state: RootState) =>
  state.board.finishCode === FinishCode.STALEMATE ||
  state.board.finishCode === FinishCode.LOST ||
  state.board.finishCode === FinishCode.GIVEN_UP ||
  state.board.finishCode === FinishCode.FINISH;

export const showGridMemoryOrderSelector = (state: RootState) => state.board.showGridMemoryOrder;

export const showStackMemoryOrderSelector = (state: RootState) => state.board.showStackMemoryOrder;

export const bucketDropListSelector = (bucketPosition: BucketPosition) => (
  state: RootState,
): BoardObject[] => {
  const bucketDropList = state.board.transcript
    .filter(({ bucketNo, code }) => code === Code.ACCEPT && bucketNo === bucketPosition)
    .map(({ pieceId }) => state.board.board[pieceId]);
  return bucketDropList.slice(Math.max(0, bucketDropList.length - state.board.stackMemoryDepth));
};

export const moveNumByBoardObjectSelector = (
  state: RootState,
): { [boardObjectId: string]: number } =>
  state.board.transcript
    .filter(({ code }) => code === Code.ACCEPT)
    .reduce((acc, { pieceId }, index) => ({ ...acc, [pieceId]: index + 1 }), {});

export const pausedSelector = (state: RootState) => state.board.isPaused;

export const boardObjectsSelector = (state: RootState) => Object.values(state.board.board);

export const ruleSrcSelector = (state: RootState) => state.board.rulesSrc;

export const ruleLineNoSelector = (state: RootState) => state.board.ruleLineNo;

export const historyInfoSelector = (state: RootState) =>
  state.board.transcript.map(({ pieceId, code, bucketNo }) => ({
    code: code === Code.ACCEPT ? 'ACCEPT' : code === Code.DENY ? 'DENY' : code,
    x: state.board.board[pieceId].x,
    y: state.board.board[pieceId].y,
    color: state.board.board[pieceId].color,
    shape: state.board.board[pieceId].shape,
    bucketNo,
  }));

export const numMovesMadeSelector = (state: RootState) => state.board.numMovesMade;

export const episodeNoSelector = (state: RootState) => state.board.episodeNo;

export const totalRewardEarnedSelector = (state: RootState) => state.board.totalRewardEarned;

export const totalBoardsPredictedSelector = (state: RootState) => state.board.totalBoardsPredicted;

export const isInBonusSelector = (state: RootState) => state.board.isInBonus;

export const canActivateBonusSelector = (state: RootState) => state.board.canActivateBonus;

export const movesLeftToStayInBonusSelector = (state: RootState) =>
  state.board.movesLeftToStayInBonus;

// The transitionMap will contain a BONUS -> DEFAULT if there are still bonus rounds
export const hasMoreBonusRoundsSelector = (state: RootState): boolean =>
  isInBonusSelector(state) && (state.board.transitionMap?.BONUS === 'DEFAULT' ?? false);

export const finishCodeSelector = (state: RootState) => state.board.finishCode;

export const episodeIdSelector = (state: RootState) => state.board.episodeId;

export const maxPointsSelector = (state: RootState) => state.board.maxPoints;
