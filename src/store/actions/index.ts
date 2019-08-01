import { ActionType } from 'typesafe-actions';
import * as game from './game';

const actions = {
  game,
};

export type RootAction = ActionType<typeof actions>;
