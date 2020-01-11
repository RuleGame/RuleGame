import { createAction, createAsyncAction } from 'typesafe-actions';
import shortid from 'shortid';
// eslint-disable-next-line import/no-cycle
import { BoardObjectType, RuleArray } from '../../@types';

export const addGame = createAsyncAction(
  [
    'games/ADD_GAME_REQUEST',
    (name: string, ruleArray: string, boardObjectsArray: string, id?: string) => ({
      name,
      ruleArray,
      boardObjectsArray,
      id: id ?? shortid(),
    }),
  ],
  [
    'games/ADD_GAME_SUCCESS',
    (
      name: string,
      ruleArray: RuleArray,
      stringifiedRuleArray: string,
      boardObjectsArray: BoardObjectType[],
      stringifiedBoardObjectsArray: string,
      id?: string,
    ) => ({
      id: id ?? shortid(),
      name,
      ruleArray,
      ruleArrayId: shortid(),
      stringifiedRuleArray,
      boardObjectsArrayId: shortid(),
      boardObjectsArray,
      stringifiedBoardObjectsArray,
    }),
  ],
  ['games/ADD_GAME_FAILURE', (error: Error) => ({ error })],
)();

export const enterGame = createAction('games/ENTER_GAME', (id: string) => ({ id }))();

export const removeGame = createAction('games/REMOVE_GAME', (id: string) => ({ id }))();
