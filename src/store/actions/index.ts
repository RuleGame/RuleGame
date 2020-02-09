import { ActionType } from 'typesafe-actions';
// Dependency cycle due to recursive type,
// and this does not affect the runtime of the code.
/* eslint-disable import/no-cycle */
import * as page from './page';
import * as ruleRow from './rule-row';
import * as layers from './layers';
import * as ruleArrays from './rule-arrays';
import * as boardObjectsArrays from './board-objects-arrays';
import * as games from './games';
import * as notifications from './notifications';
import * as game from './game';
/* eslint-enable import/no-cycle */

export const actions = {
  page,
  ruleRow,
  layers,
  ruleArrays,
  boardObjectsArrays,
  games,
  notifications,
  game,
};

export type RootAction = ActionType<typeof actions>;
