import { ActionType } from 'typesafe-actions';
// Dependency cycle due to recursive type,
// and this does not affect the runtime of the code.
/* eslint-disable import/no-cycle */
import * as page from './page';
import * as ruleRow from './rule-row';
import * as layers from './layers';
/* eslint-enable import/no-cycle */

export const actions = {
  page,
  ruleRow,
  layers,
};

export type RootAction = ActionType<typeof actions>;
