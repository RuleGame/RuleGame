import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { LayerData } from '../../@types/layers';
import { addLayer, removeLayer } from '../actions/layers';

export type State = {
  layersById: { [layerId: string]: LayerData };
  layerIds: string[];
};

export const initialState: State = {
  layersById: {},
  layerIds: [],
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(addLayer):
      return {
        ...state,
        layersById: {
          ...state.layersById,
          [action.payload.id]: {
            id: action.payload.id,
            title: action.payload.title,
            description: action.payload.description,
            actionButtons: action.payload.actionButtons,
          },
        },
        layerIds: [...state.layerIds, action.payload.id],
      };

    case getType(removeLayer): {
      const { [action.payload.id]: _, ...newLayersById } = state.layersById;

      return {
        ...state,
        layersById: newLayersById,
        layerIds: state.layerIds.filter((layerId) => layerId !== action.payload.id),
      };
    }
    default:
      return state;
  }
};

export default reducer;
