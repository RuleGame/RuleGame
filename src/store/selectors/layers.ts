import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const layerIdsSelector = (state: RootState) => state.layers.layerIds;

export const layersByIdSelector = (state: RootState) => state.layers.layersById;

export const layersSelector = createSelector(
  [layerIdsSelector, layersByIdSelector],
  (layerIds, layersById) => layerIds.map((layerId) => layersById[layerId]),
);
