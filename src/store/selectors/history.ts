import { RootState } from '../reducers';

export const playerNameSelector = (state: RootState) => state.history.playerName;

export const historySelector = (state: RootState) => {
  const { _persist: _, ...history } = state.history;
  return history;
};
