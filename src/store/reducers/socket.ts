import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { socketConnection, socketDisconnect } from '../actions/socket';

export type State = {
  connected: boolean;
  error: Error | null;
  loading: boolean;
  messages: string;
  socket: WebSocket | null;
};

export const initialState: State = {
  connected: false,
  error: null,
  loading: false,
  messages: 'N/A',
  socket: null,
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(socketConnection.request):
      return {
        ...state,
        loading: true,
        error: null,
      };

    case getType(socketConnection.success):
      return {
        ...state,
        connected: true,
        loading: false,
        error: null,
        socket: action.payload.socket,
      };

    case getType(socketDisconnect):
      // Close the socket if it exists
      if (state.socket && state.socket.readyState !== WebSocket.CLOSED) {
        state.socket.close();
      }

      return {
        ...state,
        connected: false,
        loading: false,
        error: null,
        socket: null,
      };

    case getType(socketConnection.failure):
      return {
        ...state,
        connected: false,
        loading: false,
        error: action.payload.error,
        socket: null,
      };

    default:
      return state;
  }
};

export default reducer;
