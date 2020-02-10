import { createAction, createAsyncAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { RuleArray } from '../../@types';

export const addRuleArray = createAsyncAction(
  [
    'rule-arrays/ADD_RULE_ARRAY_REQUEST',
    (name: string, rawRuleArray: string, rawOrder?: string) => ({ name, rawRuleArray, rawOrder }),
  ],
  [
    'rule-arrays/ADD_RULE_ARRAY_SUCCESS',
    (id: string, name: string, ruleArray: RuleArray, stringified: string, order?: number[]) => ({
      id,
      name,
      ruleArray,
      stringified,
      order,
    }),
  ],
  ['rule-arrays/ADD_RULE_ARRAY_FAILURE', (error: Error) => ({ error })],
)();

export const removeRuleArray = createAction('rule-arrays/REMOVE_RULE_ARRAY', (id: string) => ({
  id,
}))();
