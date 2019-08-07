import { ActionType } from 'typesafe-actions';
import * as game from './game';
import * as page from './page';

const actions = {
  game,
  page,
};

export type RootAction = ActionType<typeof actions>;
