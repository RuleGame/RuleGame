import { RootState } from '../reducers';

export const currDisplayNumSelector = (state: RootState) => state.game.numDisplaysCompleted + 1;

export const numDisplaysLeftSelector = (state: RootState) =>
  state.game.currGameId &&
  state.games.byId[state.game.currGameId].numDisplaysLimit &&
  state.games.byId[state.game.currGameId].numDisplaysLimit! - state.game.numDisplaysCompleted - 1;
