import { createAction, createAsyncAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { BoardObjectType } from '../../@types';

export const addBoardObjectsArray = createAsyncAction(
  [
    'board-objects-arrays/ADD_BOARD_OBJECTS_ARRAY',
    (boardObjectsArrayString: string) => ({ boardObjectsArrayString }),
  ],
  [
    'board-objects-arrays/ADD_BOARD_OBJECTS_ARRAY_SUCCESS',
    (id: string, boardObjectsArray: BoardObjectType[], stringified: string) => ({
      id,
      boardObjectsArray,
      stringified,
    }),
  ],
  ['board-objects-arrays/ADD_BOARD_OBJECTS_ARRAY_FAILURE', (error: Error) => ({ error })],
)();

export const removeBoardObjectsArray = createAction(
  'board-objects-arrays/REMOVE_BOARD_OBJECTS_ARRAY',
  (id: string) => ({
    id,
  }),
)();
