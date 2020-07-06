import { RootState } from '../reducers';

export const numConsecutiveSuccessfulMovesSelector = (state: RootState) =>
  state.ruleRow.numConsecutiveSuccessfulMoves;

export const currGameIdSelector = (state: RootState) => state.ruleRow.currGameId;

export const restartIfNotClearedSelector = (state: RootState) => state.ruleRow.restartIfNotCleared;

export const numRuleRowsSelector = (state: RootState) => state.ruleRow.numRuleRows;

export const noSuccessfulMovesSelector = (state: RootState) =>
  state.ruleRow.ruleArrayInfos.every((ruleArrayInfo) => ruleArrayInfo.successfulMoves === 0);

export const currGameNameSelector = (state: RootState) =>
  state.ruleRow.currGameId && state.games.byId[state.ruleRow.currGameId].name;

export const dropAttemptsSelector = (state: RootState) =>
  state.ruleRow.dropAttempts.map((dropAttempt) => ({
    ...dropAttempt,
    dragged: state.ruleRow.initialBoardObjectsById[dropAttempt.dragged],
  }));
