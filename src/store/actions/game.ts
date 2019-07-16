import { createAction } from 'typesafe-actions';
import {
  BoardObjectId,
  DropAttempt,
  BoardObjectType,
  Rule,
  BoardObjectsMapper,
} from '../../@types/index';

export const move = createAction(
  'game/MOVE',
  (action) => (
    touchAttempts: BoardObjectId[],
    dropAttempts: DropAttempt[],
    dropSuccess: DropAttempt,
  ) => action({ touchAttempts, dropAttempts, dropSuccess }),
);

export const updateBoardObject = createAction(
  'game/UPDATE_BOARD_OBJECT',
  (action) => (id: number, boardObject: Partial<BoardObjectType>) => action({ id, boardObject }),
);

export const initBoard = createAction(
  'game/INIT_BOARD',
  (action) => (rule: Rule, firstMoveMapper: BoardObjectsMapper) =>
    action({ rule, firstMoveMapper }),
);

export const resetBoard = createAction('game/RESET_BOARD');
