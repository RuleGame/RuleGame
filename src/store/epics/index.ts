import { combineEpics } from 'redux-observable';
import game from './game';
import page from './page';

export const rootEpic = combineEpics(game, page);
