import { createAction } from 'typesafe-actions';
import shortid from 'shortid';

export const addNotification = createAction(
  'layers/ADD_NOTIFICATION',
  (title: string, id: string = shortid()) => ({
    title,
    id,
  }),
)();

export const removeNotification = createAction('layers/REMOVE_NOTIFICATION', (id: string) => ({
  id,
}))();
