import { combineEpics } from 'redux-observable';
import { gameEpic } from './game';

export const rootEpic = combineEpics(gameEpic);
