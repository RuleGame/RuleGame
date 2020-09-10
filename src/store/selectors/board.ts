import { RootState } from '../reducers';
import { Code } from '../../utils/api';
import { BucketPosition } from '../../constants/BucketPosition';
import { BoardObjectType } from '../../@types';

export const isPausedSelector = (state: RootState) => state.board.isPaused;

export const bucketShapesSelector = (state: RootState) => state.board.bucketShapes;

export const seriesNoSelector = (state: RootState) => state.board.seriesNo;

// TODO: Ask for new code to check board is finished (or stalemate).
export const isGameCompletedSelector = (state: RootState) =>
  state.board.board.every((boardObject) => boardObject.dropped !== undefined) ||
  state.board.finishCode === Code.STALEMATE;

export const showGridMemoryOrderSelector = (state: RootState) => state.board.showGridMemoryOrder;

export const showStackMemoryOrderSelector = (state: RootState) => state.board.showStackMemoryOrder;

// TODO: Need server functionality
// eslint-disable-next-line no-unused-vars
export const bucketDropListSelector = (bucketPosition: BucketPosition) => (
  // eslint-disable-next-line no-unused-vars
  state: RootState,
): BoardObjectType[] => [];

// TODO: Need server functionality
export const moveNumByBoardObjectSelector = (
  // eslint-disable-next-line no-unused-vars
  state: RootState,
): { [boardObjectId: string]: number } => ({});

export const boardObjectsSelector = (state: RootState) => state.board.board;

// TODO: Need server to send history
export const historyDebugInfoSelector = (): string[] | undefined => [];

export const pausedSelector = (state: RootState) => state.board.isPaused;
