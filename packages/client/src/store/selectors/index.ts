import { createSelector } from 'reselect';
import shortid from 'shortid';
import { RootState } from '../reducers';
import { BoardObjectType, BucketPosition, ExportedFile, Shape } from '../../@types';
import { FILE_VERSION } from '../../constants';

export const pageSelector = (state: RootState) => state.page.page;

export const ruleRowIndexSelector = (state: RootState) => state.ruleRow.ruleRowIndex;

export const atomCountersSelector = (state: RootState) => state.ruleRow.atomCounts;

export const allAtomCountersZeroSelector = createSelector(
  [ruleRowIndexSelector, atomCountersSelector],
  (ruleRowIndex, atomCounters) => Object.values(atomCounters).every((count) => count <= 0),
);

export const boardObjectsByIdSelector = (state: RootState) => state.ruleRow.boardObjectsById;

export const boardObjectsSelector = createSelector([boardObjectsByIdSelector], (boardObjectsById) =>
  Object.values(boardObjectsById),
);

export const boardObjectsToBucketsToAtomsSelector = (state: RootState) =>
  state.ruleRow.boardObjectsToBucketsToAtoms;

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

export const checkedObjectsSelector = (state: RootState) => state.ruleRow.checkedObjects;

export const allChecksSelector = createSelector(
  [boardObjectsSelector, checkedObjectsSelector],
  (boardObjects, checkedObjects) => boardObjects.length === checkedObjects.size,
);

export const noMoreMovesSelector = createSelector(
  [allAtomCountersZeroSelector, boardObjectToBucketsSelector, allChecksSelector],
  (allAtomCountersZero, boardObjectToBuckets, allChecks) =>
    allAtomCountersZero ||
    Object.values(boardObjectToBuckets).every((bucketsSet) => bucketsSet.size === 0) ||
    allChecks,
);
createSelector(
  [boardObjectsSelector, boardObjectsToBucketsToAtomsSelector],
  (boardObjects, boardObjectsToBucketsToAtoms) =>
    boardObjects.filter((boardObject) => boardObject.id in boardObjectsToBucketsToAtoms),
);

export const pausedSelector = (state: RootState) => state.ruleRow.paused;

export const totalHistorySelector = (state: RootState) => state.ruleRow.totalMoveHistory;

export const dropAttemptsSelector = (state: RootState) => state.ruleRow.dropAttempts;

export const droppedBucketShapeSelector = (state: RootState): Shape => {
  if (state.ruleRow.paused) {
    return state.ruleRow.lastMoveSuccessful ? Shape.HAPPY : Shape.UNHAPPY;
  }
  return Shape.BUCKET;
};

export const droppedBucketSelector = (state: RootState) =>
  state.ruleRow.paused && state.ruleRow.dropAttempts.length > 0
    ? state.ruleRow.dropAttempts[state.ruleRow.dropAttempts.length - 1].dropped
    : undefined;

export const debugModeSelector = (state: RootState) => state.ruleRow.debugMode;

export const boardObjectsToDebugInfoSelector = createSelector(
  [debugModeSelector, boardObjectsSelector, boardObjectToBucketsSelector],
  (debugMode, boardObjects, boardObjectToBuckets) =>
    debugMode
      ? boardObjects.reduce(
          (acc1, boardObject) => ({
            ...acc1,
            [boardObject.id]: `${Object.entries(boardObject).reduce(
              (acc2, [key, value]) => `${acc2}${key}: ${value}\n`,
              '',
            )}buckets: [${
              boardObject.id in boardObjectToBuckets
                ? Array.from(boardObjectToBuckets[boardObject.id]).toString()
                : ''
            }]\n`,
          }),
          {},
        )
      : undefined,
);

export const initialBoardObjectsByIdSelector = (state: RootState) =>
  state.ruleRow.initialBoardObjectsById;

export const historyDebugInfoSelector = createSelector(
  [totalHistorySelector, initialBoardObjectsByIdSelector, debugModeSelector],
  (totalHistory, initialBoardObjectsById, debugMode) =>
    debugMode
      ? totalHistory.map(
          ({ dragged, dropped }, index) =>
            `----------------\n${index}\nBoardObject:\n${Object.entries(
              initialBoardObjectsById[dragged],
            ).reduce(
              (acc2, [key, value]) => `${acc2}${key}: ${value}\n`,
              '',
            )}\nBucket Dropped: ${dropped}`,
        )
      : undefined,
);

export const rawAtomsSelector = (state: RootState) => state.ruleRow.rawRuleArrayString;

export const gameCompletedSelector = (state: RootState) => state.ruleRow.gameCompleted;

export const layerIdsSelector = (state: RootState) => state.layers.layerIds;

export const layersByIdSelector = (state: RootState) => state.layers.layersById;

export const layersSelector = createSelector(
  [layerIdsSelector, layersByIdSelector],
  (layerIds, layersById) => layerIds.map((layerId) => layersById[layerId]),
);

export const ruleArraysByIdSelector = (state: RootState) => state.ruleArrays.byId;

export const ruleArraysIdsSelector = (state: RootState) => state.ruleArrays.allIds;

export const ruleArraysSelector = createSelector(
  [ruleArraysByIdSelector, ruleArraysIdsSelector],
  (ruleArraysById, ruleArraysIds) => ruleArraysIds.map((id) => ruleArraysById[id]),
);

export const boardObjectsArraysByIdSelector = (state: RootState) => state.boardObjectArrays.byId;

export const boardObjectsArraysIdsSelector = (state: RootState) => state.boardObjectArrays.allIds;

export const boardObjectsArraysSelector = createSelector(
  [boardObjectsArraysByIdSelector, boardObjectsArraysIdsSelector],
  (boardObjectsArraysById, boardObjectsArraysIds) =>
    boardObjectsArraysIds.map((id) => boardObjectsArraysById[id]),
);

export const gamesByIdSelector = (state: RootState) => state.games.byId;

export const gamesIdsSelector = (state: RootState) => state.games.allIds;

export const gamesSelector = createSelector(
  [gamesByIdSelector, gamesIdsSelector],
  (gamesById, gamesIds) => gamesIds.map((id) => gamesById[id]),
);

export const exportedGamesSelector = createSelector(
  [gamesByIdSelector, ruleArraysByIdSelector, boardObjectsArraysByIdSelector],
  (gamesById, ruleArraysById, boardObjectsArraysById) =>
    JSON.stringify({
      id: shortid(),
      version: FILE_VERSION,
      games: gamesById,
      ruleArrays: Object.entries(ruleArraysById).reduce<{
        [id: string]: { id: string; name: string; stringified: string };
      }>((acc, [id, curr]) => {
        const { value: _, ...rest } = curr;
        acc[id] = rest;
        return acc;
      }, {}),
      boardObjectsArrays: Object.entries(boardObjectsArraysById).reduce<{
        [id: string]: { id: string; name: string; value: BoardObjectType[] };
      }>((acc, [id, curr]) => {
        const { stringified: _, ...rest } = curr;
        acc[id] = rest;
        return acc;
      }, {}),
    } as ExportedFile),
);

export const notificationsByIdSelector = (state: RootState) => state.notifications.byId;

export const notificationsIdsSelector = (state: RootState) => state.notifications.ids;

export const notificationsSelector = createSelector(
  [notificationsByIdSelector, notificationsIdsSelector],
  (notificationsById, notificationsIds) => notificationsIds.map((id) => notificationsById[id]),
);

export const currGameIdSelector = (state: RootState) => state.game.currGameId;

export const currBoardObjectsArrayIndexSelector = (state: RootState) =>
  state.game.currBoardObjectsArrayIndex;

export const orderSelector = (state: RootState) => state.ruleRow.order;

export const currGameNumConsecutiveSuccessfulMovesBeforePromptGuessSelector = (state: RootState) =>
  state.games.byId[state.ruleRow.currGameId as string]
    .numConsecutiveSuccessfulMovesBeforePromptGuess;

export const noMoreDisplaysSelector = (state: RootState) =>
  state.game.currGameId
    ? state.game.numDisplaysCompleted + 1 >=
      (state.games.byId[state.game.currGameId]?.numDisplaysLimit ?? Infinity)
    : false;
