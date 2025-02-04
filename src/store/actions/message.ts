import { createAction, createAsyncAction } from 'typesafe-actions';
import shortid from 'shortid';

export interface Message {
  id: string;
  text: string;
  timestamp: number;
}

export const addMessage = createAction(
  'messages/ADD_MESSAGE',
  (text: string, id: string = shortid()) => ({
    id,
    text,
    timestamp: Date.now(),
  }),
)();
