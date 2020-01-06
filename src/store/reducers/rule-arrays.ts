import { getType } from 'typesafe-actions';
import { RuleArray } from '../../@types';
import { RootAction } from '../actions';
import { addRuleArray, removeRuleArray } from '../actions/rule-arrays';
import removeFirst from '../../utils/removeFirst';

export type State = {
  byId: { [id: string]: { id: string; stringified: string; value: RuleArray } };
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

    default:
      return state;
  }
};

export default reducer;
