import { createAction } from 'typesafe-actions';
import { Atom, BoardObjectType, DropAttempt } from '../../@types';

export const setNewRuleRow = createAction(
  'rule-row/SET_NEW_RULE_ROW',
  (action) => (atoms: Atom[]) => action({ atomsByRowIndex: atoms }),
);

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

export const readRuleArray = createAction(
  'rule-row/START_RULE_ARRAY',
  (action) => (fileName: string) => action({ fileName }),
);

export const setRuleArray = createAction(
  'rule-row/SET_RULE_ARRAY',
  (action) => (boardObjects: BoardObjectType[], atoms: Atom[][]) =>
    action({ boardObjects, atomsByRowIndex: atoms }),
);

export const setRuleRowIndex = createAction(
  'rule-row/SET_RULE_ROW_INDEX',
  (action) => (index: number) => action({ index }),
);

export const endRuleArray = createAction('rule-row/END_RULE_ARRAY', (action) => () => action());

export const endRuleRow = createAction('rule-row/END_RULE_ROW', (action) => () => action());

export const pauseGame = createAction('rule-row/PAUSE_GAME', (action) => () => action());

export const resumeGame = createAction('rule-row/RESUME_GAME', (action) => () => action());

export const enableDebugMode = createAction('rule-row/ENABLE_DEBUG_MODE', (action) => () =>
  action(),
);

export const disableDebugMode = createAction('rule-row/DISABLE_DEBUG_MODE', (action) => () =>
  action(),
);
