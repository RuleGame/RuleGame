import { createAction } from 'typesafe-actions';

export const nextBoardObjectsArray = createAction('game/NEXT_BOARD_OBJECTS_ARRAY', () => ({}))();

export const setGameId = createAction('game/SET_GAME_ID', (gameId: string) => ({ gameId }))();

export const setBoardObjectsArray = createAction(
  'game/SET_BOARD_OBJECTS_ARRAY',
  (index: number) => ({ index }),
)();
export const incNumDisplaysCompleted = createAction('games/INC_NUM_DISPLAYS_COMPLETED')();
