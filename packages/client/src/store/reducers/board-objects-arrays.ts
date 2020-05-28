import { getType } from 'typesafe-actions';
import storage from 'redux-persist/es/storage';
import { persistReducer } from 'redux-persist';
import { BoardObjectType } from '../../@types';
import { RootAction } from '../actions';
import removeFirst from '../../utils/removeFirst';
import { addBoardObjectsArray, removeBoardObjectsArray } from '../actions/board-objects-arrays';
import { loadGames } from '../actions/games';
import { PersistKeys, PersistVersions } from './__helpers__/PersistConstants';

export type State = {
  byId: {
    [id: string]: { id: string; name: string; stringified: string; value: BoardObjectType[] };
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
    case getType(addBoardObjectsArray.request): {
      return {
        ...state,
        isRequesting: true,
      };
    }
    case getType(addBoardObjectsArray.success): {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            id: action.payload.id,
            value: action.payload.boardObjectsArray,
            stringified: action.payload.stringified,
            name: action.payload.name,
          },
        },
        allIds: [...state.allIds, action.payload.id],
        isRequesting: false,
      };
    }

    case getType(addBoardObjectsArray.failure): {
      return {
        ...state,
        isRequesting: false,
      };
    }

    case getType(removeBoardObjectsArray): {
      const { [action.payload.id]: _, ...newById } = state.byId;

      return {
        ...state,
        byId: newById,
        allIds: removeFirst(state.allIds, action.payload.id),
      };
    }

    case getType(loadGames.success): {
      const allIdsSet = new Set(state.allIds);

      return {
        ...state,
        byId: {
          ...state.byId,
          ...action.payload.boardObjectsArrays,
        },
        allIds: [
          ...state.allIds,
          ...Object.values(action.payload.boardObjectsArrays)
            .filter((boardObjectsArray) => !allIdsSet.has(boardObjectsArray.id))
            .map((boardObjectsArray) => boardObjectsArray.id),
        ],
      };
    }

    default:
      return state;
  }
};

export default persistReducer(
  {
    version: PersistVersions[PersistKeys.BOARD_OBJECTS_ARRAYS],
    key: PersistKeys.BOARD_OBJECTS_ARRAYS,
    storage,
  },
  reducer,
);
