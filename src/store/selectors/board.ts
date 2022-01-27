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
    .filter(
      ({ bucketNo, code }) =>
        bucketNo !== undefined && code === Code.ACCEPT && bucketNo === bucketPosition,
    )
    .map(({ pieceId }) => state.board.board[pieceId]);
  return bucketDropList.slice(Math.max(0, bucketDropList.length - state.board.stackMemoryDepth));
};

export const moveNumByBoardObjectSelector = (
  state: RootState,
): { [boardObjectId: string]: number } =>
  state.board.transcript
    .filter(({ code, bucketNo }) => bucketNo !== undefined && code === Code.ACCEPT)
    .reduce((acc, { pieceId }, index) => ({ ...acc, [pieceId]: index + 1 }), {});

export const pausedSelector = (state: RootState) => state.board.isPaused;

export const boardObjectsSelector = (state: RootState) => Object.values(state.board.board);

export const ruleSrcSelector = (state: RootState) => state.board.rulesSrc;

export const ruleLineNoSelector = (state: RootState) => state.board.ruleLineNo;

export const historyInfoSelector = (state: RootState) =>
  state.board.transcript
    .filter(({ bucketNo }) => bucketNo !== undefined)
    .map(({ pieceId, code, bucketNo }) => ({
      code: code === Code.ACCEPT ? 'ACCEPT' : code === Code.DENY ? 'DENY' : code,
      x: state.board.board[pieceId].x,
      y: state.board.board[pieceId].y,
      ...(state.board.board[pieceId].color && { color: state.board.board[pieceId].color }),
      ...(state.board.board[pieceId].shape && { shape: state.board.board[pieceId].shape }),
      ...(state.board.board[pieceId].image && { image: state.board.board[pieceId].image }),
      bucketNo,
    }));

export const numMovesMadeSelector = (state: RootState) => state.board.faces?.length;
export const numGoodMovesMadeSelector = (state: RootState) =>
  state.board.faces?.reduce((acc, curr) => (curr ? acc + 1 : acc), 0);

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

export const allowGiveUpOptionSelector = (state: RootState) =>
  state.board.giveUpAt !== undefined && state.board.episodeNo >= state.board.giveUpAt;

export const displayBucketDropListsSelector = (state: RootState) =>
  state.board.stackMemoryDepth > 0;

export const feedbackSwitchesSelector = (state: RootState) => state.board.feedbackSwitches;

export const ruleSetNameSelector = (state: RootState) => state.board.ruleSetName;

export const trialListIdSelector = (state: RootState) => state.board.trialListId;

export const workerIdSelector = (state: RootState) => state.board.workerId;

export const incentiveSelector = (state: RootState) => state.board.incentive;
export const rewardsAndFactorsPerSeriesSelector = (state: RootState) =>
  state.board.rewardsAndFactorsPerSeries;
export const factorAchievedSelector = (state: RootState) => state.board.factorAchieved;
export const factorPromisedSelector = (state: RootState) => state.board.factorPromised;
export const justReachedX2Selector = (state: RootState) => state.board.justReachedX2;
export const justReachedX4Selector = (state: RootState) => state.board.justReachedX4;
export const lastStretchSelector = (state: RootState) => state.board.lastStretch;

export const goodBadMovesSelector = (state: RootState) =>
  state.board.transcript
    .filter((t) => (t.code === Code.ACCEPT || t.code === Code.DENY) && t.bucketNo !== undefined)
    .map((t) => t.code === Code.ACCEPT);

export const x2AfterSelector = (state: RootState) => state.board.x2After;
export const x4AfterSelector = (state: RootState) => state.board.x4After;

export const facesSelector = (state: RootState) => state.board.faces;
