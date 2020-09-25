import { createAction } from 'typesafe-actions';

export const setDebugMode = createAction('debug/SET_DEBUG_MODE', (debugMode: boolean) => ({
  debugMode,
}))();
