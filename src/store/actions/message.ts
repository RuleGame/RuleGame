import { createAction, createAsyncAction } from 'typesafe-actions';
import shortid from 'shortid';
import { MessageType } from '../../@types';

export const addMessage = createAction('messages/ADD_MESSAGE', (who: string, text: string) => ({
  who,
  text,
  timestamp: Date.now(),
}))();

export const removeAllMessages = createAction('messages/REMOVE_ALL_MESSAGES', () => ({}))();
