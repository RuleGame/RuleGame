import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { addNotification, removeNotification } from '../actions/notifications';
import { NotificationData } from '../../@types/notifications';

export type State = {
  byId: { [layerId: string]: NotificationData };
  ids: string[];
};

export const initialState: State = {
  byId: {},
  ids: [],
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(addNotification):
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            id: action.payload.id,
            title: action.payload.title,
          },
        },
        ids: [...state.ids, action.payload.id],
      };

    case getType(removeNotification): {
      const { [action.payload.id]: _, ...newLayersById } = state.byId;

      return {
        ...state,
        byId: newLayersById,
        ids: state.ids.filter((layerId) => layerId !== action.payload.id),
      };
    }
    default:
      return state;
  }
};

export default reducer;
