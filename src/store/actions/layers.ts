import { createAction } from 'typesafe-actions';
import shortid from 'shortid';
// eslint-disable-next-line import/no-cycle
import { ActionButton } from '../../@types';

export const addLayer = createAction(
  'layers/ADD_LAYER',
  (title: string, description: string, actionButtons: ActionButton[], id?: string) => ({
    title,
    description,
    actionButtons,
    id: id || shortid(),
  }),
)();

export const removeLayer = createAction('layers/REMOVE_LAYER', (id: string) => ({ id }))();
