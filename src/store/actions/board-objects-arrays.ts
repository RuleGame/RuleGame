import { createAction, createAsyncAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { BoardObjectType } from '../../@types';

export const addBoardObjectsArray = createAsyncAction(
  [
    'board-objects-arrays/ADD_BOARD_OBJECTS_ARRAY',
    (name: string, boardObjectsArrayString: string, addToAllGames: boolean = false) => ({
      name,
      boardObjectsArrayString,
      addToAllGames,
    }),
  ],
  [
    'board-objects-arrays/ADD_BOARD_OBJECTS_ARRAY_SUCCESS',
    (
      id: string,
      name: string,
      boardObjectsArray: BoardObjectType[],
      stringified: string,
      addToAllGames: boolean = false,
    ) => ({
      id,
      boardObjectsArray,
      stringified,
      name,
      addToAllGames,
    }),
  ],
  [
    'board-objects-arrays/ADD_BOARD_OBJECTS_ARRAY_FAILURE',
    (error: Error, boardObjectsArrayString: string) => ({ error, boardObjectsArrayString }),
  ],
)();

export const removeBoardObjectsArray = createAction(
  'board-objects-arrays/REMOVE_BOARD_OBJECTS_ARRAY',
  (id: string) => ({
    id,
  }),
)();
