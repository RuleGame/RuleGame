import { createAction } from 'typesafe-actions';
import shortid from 'shortid';
// eslint-disable-next-line import/no-cycle
import { ActionButton } from '../../@types';

// TODO: Consider a wrapper function that takes in a callback with id as its parameter
export const addLayer = createAction(
  'layers/ADD_LAYER',
  (
    title: string,
    description: React.ReactNode,
    actionButtons: ActionButton[],
    id?: string,
    closeOnEsc = true,
    closeOnClickOutside = true,
  ) => ({
    title,
    description,
    actionButtons,
    id: id || shortid(),
    closeOnEsc,
    closeOnClickOutside,
  }),
)();

export const removeLayer = createAction('layers/REMOVE_LAYER', (id: string) => ({ id }))();
