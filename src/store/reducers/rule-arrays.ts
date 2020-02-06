import { getType } from 'typesafe-actions';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { RuleArray } from '../../@types';
import { RootAction } from '../actions';
import { addRuleArray, removeRuleArray } from '../actions/rule-arrays';
import removeFirst from '../../utils/removeFirst';
import { loadGames } from '../actions/games';
import { PersistKeys, PersistVersions } from './__helpers__/PersistConstants';

export type State = {
  byId: { [id: string]: { id: string; name: string; stringified: string; value: RuleArray } };
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
    case getType(addRuleArray.request): {
      return {
        ...state,
        isRequesting: true,
      };
    }
    case getType(addRuleArray.success): {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            id: action.payload.id,
            value: action.payload.ruleArray,
            stringified: action.payload.stringified,
            name: action.payload.name,
          },
        },
        allIds: [...state.allIds, action.payload.id],
        isRequesting: false,
      };
    }

    case getType(addRuleArray.failure): {
      return {
        ...state,
        isRequesting: false,
      };
    }

    case getType(removeRuleArray): {
      const { [action.payload.id]: _, ...newById } = state.byId;

      return {
        ...state,
        byId: newById,
        allIds: removeFirst(state.allIds, action.payload.id),
      };
    }

    case getType(loadGames.success): {
      return {
        ...state,
        byId: {
          ...state.byId,
          ...action.payload.ruleArrays,
        },
      };
    }

    default:
      return state;
  }
};

export default persistReducer(
  {
    version: PersistVersions[PersistKeys.RULE_ARRAYS],
    key: PersistKeys.RULE_ARRAYS,
    storage,
  },
  reducer,
);
