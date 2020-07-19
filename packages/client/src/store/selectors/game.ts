import { RootState } from '../reducers';

export const currDisplayNumSelector = (state: RootState) => state.game.numDisplaysCompleted + 1;
