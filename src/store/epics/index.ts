import { combineEpics } from 'redux-observable';
import page from './page';
import ruleRow from './rule-row';
import ruleArrays from './rule-arrays';
import boardObjectsArrays from './board-object-arrays';

export const rootEpic = combineEpics(page, ruleRow, ruleArrays, boardObjectsArrays);
