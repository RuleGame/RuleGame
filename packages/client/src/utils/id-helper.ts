import shortid from 'shortid';
import { RootAction } from '../store/actions';

export const idHelper = (cb: (id: string) => RootAction) => cb(shortid());
