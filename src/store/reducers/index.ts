import { combineReducers, Reducer } from 'redux';
import { History } from 'history';
import page from './page';
import ruleRow from './rule-row';
import layers from './layers';
import ruleArrays from './rule-arrays';

export const createRootReducer = () =>
  combineReducers({
    page,
    ruleRow,
    layers,
    ruleArrays,
  });

export default createRootReducer;

export type RootState = (typeof createRootReducer) extends (history: History) => Reducer<infer S>
  ? S
  : never;
