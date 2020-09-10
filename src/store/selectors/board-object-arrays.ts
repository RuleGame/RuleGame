import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const boardObjectsArraysByIdSelector = (state: RootState) => state.boardObjectArrays.byId;

export const boardObjectsArraysIdsSelector = (state: RootState) => state.boardObjectArrays.allIds;

export const boardObjectsArraysSelector = createSelector(
  [boardObjectsArraysByIdSelector, boardObjectsArraysIdsSelector],
  (boardObjectsArraysById, boardObjectsArraysIds) =>
    boardObjectsArraysIds.map((id) => boardObjectsArraysById[id]),
);
