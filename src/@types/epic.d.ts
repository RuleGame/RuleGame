import { Epic } from 'redux-observable';
import { RootAction } from '../store/actions';
import { RootState } from '../store/reducers';

export type RootEpic = Epic<RootAction, RootAction, RootState>;
