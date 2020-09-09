import { RootState } from '../reducers';
import { Code } from '../../utils/api';

export const isPausedSelector = (state: RootState) => state.board.isPaused;

export const bucketShapesSelector = (state: RootState) => state.board.bucketShapes;

export const seriesNoSelector = (state: RootState) => state.board.seriesNo;

// TODO: Ask for new code to check board is finished (or stalemate).
export const isGameCompletedSelector = (state: RootState) =>
  state.board.board.every((boardObject) => boardObject.dropped !== undefined) ||
  state.board.finishCode === Code.STALEMATE;
