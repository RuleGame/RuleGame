import { RootState } from '../reducers';

export const numConsecutiveSuccessfulMovesSelector = (state: RootState) =>
  state.ruleRow.numConsecutiveSuccessfulMoves;

export const currGameIdSelector = (state: RootState) => state.ruleRow.currGameId;

export const restartIfNotClearedSelector = (state: RootState) => state.ruleRow.restartIfNotCleared;

export const numRuleRowsSelector = (state: RootState) => state.ruleRow.numRuleRows;

export const hasRestartedSelector = (state: RootState) => state.ruleRow.hasRestarted;
