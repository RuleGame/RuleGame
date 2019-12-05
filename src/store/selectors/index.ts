import { createSelector } from 'reselect';
import pickBy from 'lodash/pickBy';
import { RootState } from '../reducers';
import { BucketPosition, Shape } from '../../@types';

// export const boardObjectsByIdSelector = (state: RootState) => state.game.boardObjectsById;

// export const boardObjectsListSelector = createSelector(
//   [boardObjectsByIdSelector],
//   (boardObjectsById) => Object.values(boardObjectsById),
// );

// export const allCheckedSelector = createSelector(
//   [boardObjectsListSelector],
//   (boardObjectsList) => boardObjectsList.every((boardObject) => boardObject.shape === 'check'),
// );

// export const numBoardObjectsSelector = createSelector(
//   [boardObjectsListSelector],
//   (boardObjectsList) => boardObjectsList.length,
// );

// export const ruleSelector = (state: RootState) => state.game.rule;

export const pageSelector = (state: RootState) => state.page.page;

// export const logsSelector = (state: RootState) => state.game.logs;

export const atomsByIdSelector = (state: RootState) => state.ruleRow.atomsByRowIndex;

export const ruleRowIndexSelector = (state: RootState) => state.ruleRow.ruleRowIndex;

export const atomCountersSelector = (state: RootState) => state.ruleRow.atomCounts;

export const allAtomCountersZeroSelector = createSelector(
  [atomsByIdSelector, ruleRowIndexSelector, atomCountersSelector],
  (atomsByRuleRowIndex, ruleRowIndex, atomCounters) =>
    Object.values(atomsByRuleRowIndex[ruleRowIndex]).every((atom) => atomCounters[atom.id] <= 0),
);

export const boardObjectsByIdSelector = (state: RootState) => state.ruleRow.boardObjectsById;

export const boardObjectsSelector = createSelector(
  [boardObjectsByIdSelector],
  (boardObjectsById) => Object.values(boardObjectsById),
);

export const boardObjectsToBucketsToAtomsSelector = (state: RootState) =>
  state.ruleRow.boardObjectsToBucketsToAtoms;

// export const boardObjectToBucketsSelector = createSelector(
//   [boardObjectsToBucketsToAtomsSelector],
//   (boardObjectsToBucketsToAtoms) =>
//     Object.entries(boardObjectsToBucketsToAtoms).reduce<{
//       [boardObjectId: string]: Set<BucketPosition>;
//     }>(
//       (acc, [boardObjectId, bucketToAtoms]) => ({
//         [boardObjectId]: new Set(
//           Object.entries(bucketToAtoms)
//             .filter(([, atomsSet]) => atomsSet.size > 0)
//             .map(([bucket]) => (bucket as unknown) as BucketPosition),
//         ),
//       }),
//       {},
//     ),
// );

export const boardObjectToBucketsSelector = createSelector(
  [boardObjectsToBucketsToAtomsSelector],
  (boardObjectsToBucketsToAtoms) => {
    return Object.entries(boardObjectsToBucketsToAtoms).reduce<{
      [boardObjectId: string]: Set<BucketPosition>;
    }>((acc, [boardObjectId, bucketToAtoms]) => {
      const nonEmptyBuckets = Object.entries(bucketToAtoms)
        .filter(([, bucketSet]) => bucketSet.size > 0)
        .map(([bucketId]) => bucketId);

      return {
        ...acc,
        [boardObjectId]: new Set((nonEmptyBuckets as unknown) as BucketPosition[]),
      };
    }, {});
  },
);

export const gameStartedSelector = (state: RootState) => !Number.isNaN(state.ruleRow.ruleRowIndex);

export const allChecksSelector = createSelector(
  [boardObjectsSelector],
  (boardObjects) => boardObjects.every((boardObject) => boardObject.shape === Shape.CHECK),
);
export const noMoreMovesSelector = createSelector(
  [allAtomCountersZeroSelector, boardObjectToBucketsSelector, allChecksSelector],
  (allAtomCountersZero, boardObjectToBuckets, allChecks) =>
    allAtomCountersZero ||
    Object.values(boardObjectToBuckets).every((bucketsSet) => bucketsSet.size === 0) ||
    allChecks,
);

export const visibleBoardObjectsSelector = createSelector(
  [boardObjectsSelector, boardObjectsToBucketsToAtomsSelector],
  (boardObjects, boardObjectsToBucketsToAtoms) =>
    boardObjects.filter((boardObject) => boardObject.id in boardObjectsToBucketsToAtoms),
);

export const pausedSelector = (state: RootState) => state.ruleRow.paused;

export const disabledBucketSelector = (state: RootState) =>
  state.ruleRow.paused && state.ruleRow.totalMoveHistory.length > 0
    ? state.ruleRow.totalMoveHistory[state.ruleRow.totalMoveHistory.length - 1].dropped
    : undefined;
