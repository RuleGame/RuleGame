import React from 'react';
import Layer from './Layer';
import { LayerData } from '../@types/layers';

const Layers: React.FunctionComponent<{
  onLayerClose: (layerId: string) => void;
  layers: LayerData[];
}> = ({ onLayerClose, layers }) => {
  return (
    <>
      {layers.map((layer) => (
        <Layer layer={layer} onLayerClose={onLayerClose} key={layer.id} />
      ))}
    </>
  );
};

export default Layers;
