import { ActionType } from 'typesafe-actions';
// import * as game from './game';
import * as page from './page';
import * as ruleRow from './rule-row';

const actions = {
  // game,
  page,
  ruleRow,
};

export type RootAction = ActionType<typeof actions>;
