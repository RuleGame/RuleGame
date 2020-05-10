import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import Layer from './Layer';
import { layersSelector } from '../store/selectors';
import { removeLayer } from '../store/actions/layers';
import { RootAction } from '../store/actions';

const Layers: React.FunctionComponent = () => {
  const layers = useSelector(layersSelector);
  const dispatch: Dispatch<RootAction> = useDispatch();

  return (
    <>
      {layers.map((layer) => (
        <Layer
          layer={layer}
          onLayerClose={(layerId: string) => dispatch(removeLayer(layerId))}
          key={layer.id}
        />
      ))}
    </>
  );
};

export default Layers;
