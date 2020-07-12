import { createAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { DropAttempt } from '../../@types';

export const setPlayerName = createAction('history/SET_PLAYER_NAME', (playerName) => ({
  playerName,
}))();
export const logMove = createAction('game/MOVE', (dropAttempt: DropAttempt, time: number) => ({
  dropAttempt,
  time,
}))();
