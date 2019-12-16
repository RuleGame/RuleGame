import { createAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { Atom, BoardObjectType, DropAttempt } from '../../@types';

export const move = createAction('rule-row/MOVE', (action) => (dropAttempt: DropAttempt) =>
  action({ dropAttempt }),
);

export const touch = createAction('rule-row/TOUCH', (action) => (boardObjectId: string) =>
  action({ boardObjectId }),
);

export const removeBoardObject = createAction(
  'rule-row/REMOVE_BOARD_OBJECT',
  (action) => (boardObjectId: string) => action({ boardObjectId }),
);

export const loadRuleArrayRequest = createAction(
  'rule-row/LOAD_RULE_ARRAY_REQUEST',
  (action) => (boardObjects: BoardObjectType[], rawRuleArrayString: string) =>
    action({ boardObjects, rawRuleArrayString }),
);

export const loadRuleArraySuccess = createAction(
  'rule-row/LOAD_RULE_ARRAY_SUCCESS',
  (action) => (boardObjects: BoardObjectType[], ruleArray: Atom[][], rawRuleArrayString?: string) =>
    action({ boardObjects, ruleArray, rawRuleArrayString }),
);

export const loadRuleArrayFailure = createAction(
  'rule-row/LOAD_RULE_ARRAY_FAILURE',
  (action) => (error: Error) => action({ error }),
);

export const setRuleRowIndex = createAction(
  'rule-row/SET_RULE_ROW_INDEX',
  (action) => (index: number) => action({ index }),
);

export const endRuleArray = createAction('rule-row/END_RULE_ARRAY', (action) => () => action());

export const endRuleRow = createAction('rule-row/END_RULE_ROW', (action) => () => action());

export const resumeGame = createAction('rule-row/RESUME_GAME', (action) => () => action());

export const enableDebugMode = createAction('rule-row/ENABLE_DEBUG_MODE', (action) => () =>
  action(),
);

export const disableDebugMode = createAction('rule-row/DISABLE_DEBUG_MODE', (action) => () =>
  action(),
);

export const completeGame = createAction('rule-row/COMPLETE_GAME', (action) => () => action());
