import { combineEpics } from 'redux-observable';
// import game from './game';
import page from './page';
import ruleRow from './rule-row';

export const rootEpic = combineEpics(page, ruleRow);
