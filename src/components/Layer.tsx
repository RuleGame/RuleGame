import React, { useCallback } from 'react';
import { Box, Heading, Layer as GrommetLayer } from 'grommet';
import { LayerData } from '../@types/layers';
import ActionButton from './ActionButton';

const Layer: React.FunctionComponent<{
  layer: LayerData;
  onLayerClose: (layerId: string) => void;
}> = ({ layer, onLayerClose }) => {
  const closeLayer = useCallback(() => onLayerClose(layer.id), [layer.id, onLayerClose]);

  return (
    <GrommetLayer
      onEsc={layer.closeOnEsc ? closeLayer : undefined}
      onClickOutside={layer.closeOnClickOutside ? closeLayer : undefined}
      position="top"
    >
      <Box pad="large" overflow="auto">
        <Heading color="red" level="3">
          {layer.title}
        </Heading>
        {layer.description}
        <div>
          {layer.actionButtons.map((actionButton) => (
            <ActionButton actionButton={actionButton} key={actionButton.key} />
          ))}
        </div>
      </Box>
    </GrommetLayer>
  );
};

export default Layer;
