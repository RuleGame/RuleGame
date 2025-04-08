import { RootState } from '../reducers';

export const socketSelector = (state: RootState) => state.socket.socket;
