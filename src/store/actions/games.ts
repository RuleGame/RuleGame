import { createAction, createAsyncAction } from 'typesafe-actions';
import shortid from 'shortid';
// eslint-disable-next-line import/no-cycle
import { BoardObjectType, Game, RuleArray } from '../../@types';

export const loadGames = createAsyncAction(
  [
    'games/LOAD_GAMES_REQUEST',
    (file: File, id: string = shortid()) => ({
      file,
      id,
    }),
  ],
  [
    'games/LOAD_GAMES_SUCCESS',
    (
      games: { [id: string]: Game },
      ruleArrays: {
        [id: string]: { id: string; name: string; stringified: string; value: RuleArray };
      },
      boardObjectsArrays: {
        [id: string]: { id: string; name: string; stringified: string; value: BoardObjectType[] };
      },
      id: string,
    ) => ({
      games,
      ruleArrays,
      boardObjectsArrays,
      id,
    }),
  ],
  ['games/LOAD_GAMES_FAILURE', (error: Error, id: string) => ({ error, id })],
)();

export const addGame = createAction(
  'games/ADD_GAME',
  (name: string, ruleArray: string, boardObjectsArrays: string[]) => ({
    name,
    id: shortid(),
    ruleArray,
    boardObjectsArrays,
  }),
)();

export const setGameRuleArray = createAction(
  'games/SET_GAME_RULE_ARRAY',
  (id: string, ruleArray: string) => ({
    id,
    ruleArray,
  }),
)();

export const setGameBoardObjectsArrays = createAction(
  'games/SET_GAME_BOARD_OBJECTS_ARRAYS',
  (id: string, boardObjectsArrays: string[]) => ({
    id,
    boardObjectsArrays,
  }),
)();

export const enterGame = createAction('games/ENTER_GAME', (id: string) => ({ id }))();

export const removeGame = createAction('games/REMOVE_GAME', (id: string) => ({ id }))();

// export const addGameBoardObjectsArrays = createAction(
//   'games/ADD_GAME_BOARD_OBJECTS_ARRAYS',
//   (id: string, boardObjectsArrays: string[]) => ({ id, boardObjectsArrays }),
// );
