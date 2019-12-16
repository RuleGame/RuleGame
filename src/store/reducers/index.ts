import { combineReducers, Reducer } from 'redux';
import { History } from 'history';
import page from './page';
import ruleRow from './rule-row';
import layers from './layers';

export const createRootReducer = () =>
  combineReducers({
    page,
    ruleRow,
    layers,
  });

export default createRootReducer;

export type RootState = (typeof createRootReducer) extends (history: History) => Reducer<infer S>
  ? S
  : never;
