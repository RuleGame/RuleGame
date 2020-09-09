import { combineReducers, Reducer } from 'redux';
import { History } from 'history';
import page from './page';
import ruleRow from './rule-row';
import layers from './layers';
import ruleArrays from './rule-arrays';
import boardObjectArrays from './board-objects-arrays';
import games from './games';
import notifications from './notifications';
import game from './game';
import history from './history';
import board from './board';

export const createRootReducer = () =>
  combineReducers({
    page,
    ruleRow,
    layers,
    ruleArrays,
    boardObjectArrays,
    games,
    notifications,
    game,
    history,
    board,
  });

export default createRootReducer;

export type RootState = typeof createRootReducer extends (history: History) => Reducer<infer S>
  ? S
  : never;
