import { combineReducers, Reducer } from 'redux';
import { History } from 'history';
import page from './page';
import ruleRow from './rule-row';

export const createRootReducer = () =>
  combineReducers({
    // game,
    page,
    ruleRow,
  });

export default createRootReducer;

export type RootState = (typeof createRootReducer) extends (history: History) => Reducer<infer S>
  ? S
  : never;
