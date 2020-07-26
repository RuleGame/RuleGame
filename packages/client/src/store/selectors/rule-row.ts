import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { BoardObjectType, BucketPosition, DropAttempt } from '../../@types';
import { totalHistorySelector } from './index';

export const numConsecutiveSuccessfulMovesSelector = (state: RootState) =>
  state.ruleRow.numConsecutiveSuccessfulMoves;

export const currGameIdSelector = (state: RootState) => state.ruleRow.currGameId;

export const restartIfNotClearedSelector = (state: RootState) => state.ruleRow.restartIfNotCleared;

export const numRuleRowsSelector = (state: RootState) => state.ruleRow.numRuleRows;

export const noSuccessfulMovesSelector = (state: RootState) =>
  state.ruleRow.ruleArrayInfos.every((ruleArrayInfo) => ruleArrayInfo.successfulMoves === 0);

export const currGameNameSelector = (state: RootState) =>
  state.ruleRow.currGameId && state.games.byId[state.ruleRow.currGameId].name;

export const latestDropAttemptSelector = (state: RootState): DropAttempt =>
  state.ruleRow.dropAttempts[state.ruleRow.dropAttempts.length - 1];

export const gamePausedSelector = (state: RootState) => state.ruleRow.paused;

export const bucketDropListSelector = (bucketPosition: BucketPosition) => (
  state: RootState,
): BoardObjectType[] =>
  state.ruleRow.totalMoveHistory
    .filter((dropAttempt) => dropAttempt.dropped === bucketPosition)
    .map((dropAttempt) => dropAttempt.dragged)
    .map((boardObjectId) => state.ruleRow.initialBoardObjectsById[boardObjectId]);

export const moveNumByBoardObjectSelector = createSelector([totalHistorySelector], (dropAttempts) =>
  dropAttempts.reduce<{ [boardObjectId: string]: number }>(
    (acc, dropAttempt, i) => ({
      ...acc,
      [dropAttempt.dragged]: i + 1,
    }),
    {},
  ),
);
