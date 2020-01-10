import { getType } from 'typesafe-actions';
import { BoardObjectType } from '../../@types';
import { RootAction } from '../actions';
import removeFirst from '../../utils/removeFirst';
import { addBoardObjectsArray, removeBoardObjectsArray } from '../actions/board-objects-arrays';

export type State = {
  byId: {
    [id: string]: { id: string; stringified: string; value: BoardObjectType[] };
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

    default:
      return state;
  }
};

export default reducer;
