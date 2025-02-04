import { createAction, createAsyncAction } from 'typesafe-actions';

// Socket connection async action
export const socketConnection = createAsyncAction(
  ['socket/CONNECT_REQUEST', () => ({})],
  ['socket/CONNECT_SUCCESS', () => ({})],
  ['socket/CONNECT_FAILURE', (error: Error) => ({ error })],
)();

// Socket disconnect action
export const socketDisconnect = createAction('socket/DISCONNECT', () => ({}))();
