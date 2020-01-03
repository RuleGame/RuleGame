import { createAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { Atom, BoardObjectType, DropAttempt } from '../../@types';

export const move = createAction('rule-row/MOVE', (dropAttempt: DropAttempt) => ({
  dropAttempt,
}))();

export const touch = createAction('rule-row/TOUCH', (boardObjectId: string) => ({
  boardObjectId,
}))();

export const removeBoardObject = createAction(
  'rule-row/REMOVE_BOARD_OBJECT',
  (boardObjectId: string) => ({ boardObjectId }),
)();

export const loadRuleArrayRequest = createAction(
  'rule-row/LOAD_RULE_ARRAY_REQUEST',
  (boardObjects: BoardObjectType[], rawRuleArrayString: string) => ({
    boardObjects,
    rawRuleArrayString,
  }),
)();

export const loadRuleArraySuccess = createAction(
  'rule-row/LOAD_RULE_ARRAY_SUCCESS',
  (boardObjects: BoardObjectType[], ruleArray: Atom[][], rawRuleArrayString?: string) => ({
    boardObjects,
    ruleArray,
    rawRuleArrayString,
  }),
)();

export const loadRuleArrayFailure = createAction(
  'rule-row/LOAD_RULE_ARRAY_FAILURE',
  (error: Error) => ({ error }),
)();

export const setRuleRowIndex = createAction('rule-row/SET_RULE_ROW_INDEX', (index: number) => ({
  index,
}))();

export const endRuleArray = createAction('rule-row/END_RULE_ARRAY')();

export const endRuleRow = createAction('rule-row/END_RULE_ROW')();

export const resumeGame = createAction('rule-row/RESUME_GAME')();

export const enableDebugMode = createAction('rule-row/ENABLE_DEBUG_MODE')();

export const disableDebugMode = createAction('rule-row/DISABLE_DEBUG_MODE')();

export const completeGame = createAction('rule-row/COMPLETE_GAME')();
