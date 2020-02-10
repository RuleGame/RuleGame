import { getType } from 'typesafe-actions';
import { createTransform, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { ValuesType } from 'utility-types';
import { RuleArray } from '../../@types';
import { RootAction } from '../actions';
import { addRuleArray, removeRuleArray } from '../actions/rule-arrays';
import removeFirst from '../../utils/removeFirst';
import { loadGames } from '../actions/games';
import { PersistKeys, PersistVersions } from './__helpers__/PersistConstants';
import { parseRuleArray } from '../../utils/atom-parser';

export type State = {
  byId: {
    [id: string]: {
      id: string;
      name: string;
      stringified: string;
      value: RuleArray;
      order?: number[];
    };
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
            order: action.payload.order,
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
      const allIdsSet = new Set(state.allIds);

      return {
        ...state,
        byId: {
          ...state.byId,
          ...action.payload.ruleArrays,
        },
        allIds: [
          ...state.allIds,
          ...Object.values(action.payload.ruleArrays)
            .filter((ruleArray) => !allIdsSet.has(ruleArray.id))
            .map((ruleArray) => ruleArray.id),
        ],
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
    transforms: [
      // Required to reparse because functions are not serializable in
      // local storage
      createTransform<ValuesType<State>, ValuesType<State>, State, State>(
        null,
        (outboundState, key) =>
          key === 'byId'
            ? Object.entries(outboundState).reduce(
                (acc, [id, curr]) => ({
                  ...acc,
                  [id]: { ...curr, value: parseRuleArray(curr.stringified) },
                }),
                {},
              )
            : outboundState,
      ),
    ],
  },
  reducer,
);
