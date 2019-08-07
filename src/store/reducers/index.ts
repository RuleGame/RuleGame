import { combineReducers, Reducer } from 'redux';
import { History } from 'history';
import game from './game';
import page from './page';

export const createRootReducer = () =>
  combineReducers({
    game,
    page,
  });

export default createRootReducer;

export type RootState = (typeof createRootReducer) extends (history: History) => Reducer<infer S>
  ? S
  : never;
