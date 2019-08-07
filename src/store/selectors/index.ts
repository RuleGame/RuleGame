import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const boardObjectsByIdSelector = (state: RootState) => state.game.boardObjectsById;

export const boardObjectsListSelector = createSelector(
  [boardObjectsByIdSelector],
  (boardObjectsById) => Object.values(boardObjectsById),
);

export const allCheckedSelector = createSelector(
  [boardObjectsListSelector],
  (boardObjectsList) => boardObjectsList.every((boardObject) => boardObject.shape === 'check'),
);

export const numBoardObjectsSelector = createSelector(
  [boardObjectsListSelector],
  (boardObjectsList) => boardObjectsList.length,
);

export const ruleSelector = (state: RootState) => state.game.rule;

export const pageSelector = (state: RootState) => state.page.page;

export const logsSelector = (state: RootState) => state.game.logs;
