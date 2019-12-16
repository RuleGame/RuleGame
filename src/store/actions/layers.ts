import { createAction } from 'typesafe-actions';
import shortid from 'shortid';
import { Action } from 'redux';
// eslint-disable-next-line import/no-cycle
import { ActionButton } from '../../@types';

// Workaround for including RootAction in the addLayer
// action. Both action creators below must be exactly the same
// except the addLayerTemp includes Action only.
const addLayerTemp = createAction(
  'layers/ADD_LAYER',
  (action) => (
    title: string,
    description: string,
    actionButtons: (ActionButton & { action: Action })[],
    id?: string,
  ) => action({ title, description, actionButtons, id: id || shortid() }),
);

export const addLayer: (
  title: string,
  description: string,
  actionButtons: ActionButton[],
  id?: string,
) => ReturnType<typeof addLayerTemp> = createAction(
  'layers/ADD_LAYER',
  (action) => (title: string, description: string, actionButtons: ActionButton[], id?: string) =>
    action({ title, description, actionButtons, id: id || shortid() }),
);

export const removeLayer = createAction('layers/REMOVE_LAYER', (action) => (id: string) =>
  action({ id }),
);
