import { getType } from 'typesafe-actions';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { RootAction } from '../actions';
import removeFirst from '../../utils/removeFirst';
import { addGame, removeGame } from '../actions/games';
import { PersistKeys } from './__helpers__/PersistKeys';

const persistConfig = {
  key: PersistKeys.GAMES,
  storage,
};

export type State = {
  byId: {
    [id: string]: { id: string; name: string; ruleArray: string; boardObjectsArray: string };
  };
  allIds: string[];
  isRequesting: boolean;
};

export const initialState: State = {
  byId: {},
  allIds: [],
  isRequesting: false,
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(addGame.request): {
      return {
        ...state,
        isRequesting: true,
      };
    }
    case getType(addGame.success): {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            id: action.payload.id,
            ruleArray: action.payload.ruleArrayId,
            boardObjectsArray: action.payload.boardObjectsArrayId,
            name: action.payload.name,
          },
        },
        allIds: [...state.allIds, action.payload.id],
        isRequesting: false,
      };
    }

    case getType(addGame.failure): {
      return {
        ...state,
        isRequesting: false,
      };
    }

    case getType(removeGame): {
      const { [action.payload.id]: _, ...newById } = state.byId;

      return {
        ...state,
        byId: newById,
        allIds: removeFirst(state.allIds, action.payload.id),
      };
    }

    default:
      return state;
  }
};

export default persistReducer(persistConfig, reducer);
