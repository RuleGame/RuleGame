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

export const loadRuleArray = createAction(
  'rule-row/LOAD_RULE_ARRAY',
  (
    boardObjects: BoardObjectType[],
    ruleArray: Atom[][],
    gameId: string,
    rawRuleArrayString?: string,
    order?: number[],
  ) => ({
    boardObjects,
    ruleArray,
    gameId,
    rawRuleArrayString,
    order,
  }),
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
