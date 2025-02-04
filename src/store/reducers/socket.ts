import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { socketConnection, socketDisconnect } from '../actions/socket';

export type State = {
  connected: boolean;
  error: Error | null;
  loading: boolean;
  messages: string;
};

export const initialState: State = {
  connected: false,
  error: null,
  loading: false,
  messages: 'N/A',
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
      };

    case getType(socketConnection.failure):
      return {
        ...state,
        connected: false,
        loading: false,
        error: action.payload.error,
      };

    case getType(socketDisconnect):
      return {
        ...state,
        connected: false,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default reducer;
