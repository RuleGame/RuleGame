import { combineEpics } from 'redux-observable';
import page from './page';
import ruleRow from './rule-row';
import ruleArray from './rule-arrays';

export const rootEpic = combineEpics(page, ruleRow, ruleArray);
