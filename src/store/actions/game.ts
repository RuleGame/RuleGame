import { createAction } from 'typesafe-actions';
import {
  BoardObjectId,
  DropAttempt,
  BoardObjectType,
  Rule,
  BoardObjectsMapper,
} from '../../@types';

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
  (action) => (firstMoveMapper: BoardObjectsMapper, positionsMapper: BoardObjectsMapper) =>
    action({ firstMoveMapper, positionsMapper }),
);

export const resetBoard = createAction('game/RESET_BOARD');

export const setRule = createAction('game/SET_RULE', (action) => (rule: Rule) => action({ rule }));
