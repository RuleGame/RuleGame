import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const gamesByIdSelector = (state: RootState) => state.games.byId;

export const gamesIdsSelector = (state: RootState) => state.games.allIds;

export const gamesSelector = createSelector(
  [gamesByIdSelector, gamesIdsSelector],
  (gamesById, gamesIds) => gamesIds.map((id) => gamesById[id]),
);
