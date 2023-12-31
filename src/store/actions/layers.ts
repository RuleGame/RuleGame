import { createAction } from 'typesafe-actions';
import shortid from 'shortid';
import { Optional } from 'utility-types';
// eslint-disable-next-line import/no-cycle
import { ActionButton } from '../../@types';
import { CyLayer } from '../../constants/data-cy';

// TODO: Consider a wrapper function that takes in a callback with id as its parameter
export const addLayer = createAction(
  'layers/ADD_LAYER',
  (
    title: React.ReactNode,
    description: React.ReactNode,
    actionButtons: Optional<ActionButton, 'key'>[],
    id?: string,
    closeOnEsc = true,
    closeOnClickOutside = true,
    dataCyIdentifier?: CyLayer,
  ) => {
    const actionButtonsWithKeys: ActionButton[] = actionButtons.map(
      (actionButton) =>
        (actionButton.key === undefined
          ? { ...actionButton, key: shortid() }
          : actionButton) as ActionButton,
    );
    return {
      title,
      description,
      actionButtons: actionButtonsWithKeys,
      id: id || shortid(),
      closeOnEsc,
      closeOnClickOutside,
      dataCyIdentifier,
    };
  },
)();

export const removeLayer = createAction('layers/REMOVE_LAYER', (id: string) => ({ id }))();
