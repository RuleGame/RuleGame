import { RootState } from '../reducers';
import { BoardObject, Code } from '../../utils/api';
import { BucketPosition } from '../../constants/BucketPosition';

export const isPausedSelector = (state: RootState) => state.board.isPaused;

export const bucketShapesSelector = (state: RootState) => state.board.bucketShapes;

export const seriesNoSelector = (state: RootState) => state.board.seriesNo;

// TODO: Ask for new code to check board is finished (or stalemate).
export const isGameCompletedSelector = (state: RootState) =>
  Object.values(state.board.board).every((boardObject) => boardObject.dropped !== undefined) ||
  state.board.finishCode === Code.STALEMATE;

export const showGridMemoryOrderSelector = (state: RootState) => state.board.showGridMemoryOrder;

export const showStackMemoryOrderSelector = (state: RootState) => state.board.showStackMemoryOrder;

export const bucketDropListSelector = (bucketPosition: BucketPosition) => (
  state: RootState,
): BoardObject[] =>
  state.board.transcript
    .filter(({ bucketNo, code }) => code === Code.ACCEPT && bucketNo === bucketPosition)
    .map(({ pieceId }) => state.board.board[pieceId]);

export const moveNumByBoardObjectSelector = (
  state: RootState,
): { [boardObjectId: string]: number } =>
  state.board.transcript
    .filter(({ code }) => code === Code.ACCEPT)
    .reduce((acc, { pieceId }, index) => ({ ...acc, [pieceId]: index + 1 }), {});

// TODO: Need server to send history
export const historyDebugInfoSelector = (): string[] | undefined => [];

export const pausedSelector = (state: RootState) => state.board.isPaused;

export const boardObjectsSelector = (state: RootState) => Object.values(state.board.board);
