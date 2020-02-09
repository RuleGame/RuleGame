import { createAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { ActionButton } from '../../@types';

export const addNotification = createAction(
  'layers/ADD_NOTIFICATION',
  (title: string, actionButtons: ActionButton[], id: string) => ({
    title,
    actionButtons,
    id,
  }),
)();

export const removeNotification = createAction('layers/REMOVE_NOTIFICATION', (id: string) => ({
  id,
}))();
