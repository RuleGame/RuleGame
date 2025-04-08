import { createAction, createAsyncAction } from 'typesafe-actions';

// Socket connection async action
export const socketConnection = createAsyncAction(
  ['socket/CONNECT_REQUEST', (playerId: string) => ({ playerId })],
  ['socket/CONNECT_SUCCESS', (socket: WebSocket) => ({ socket })],
  ['socket/CONNECT_FAILURE', (error: Error) => ({ error })],
)();

// Socket disconnect action
export const socketDisconnect = createAction('socket/DISCONNECT', () => ({}))();
