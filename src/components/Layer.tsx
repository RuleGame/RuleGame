import React, { useCallback } from 'react';
import { Layer as GrommetLayer, Text, Heading, Paragraph, Box } from 'grommet';
import { LayerData } from '../@types/layers';
import ActionButton from './ActionButton';

const Layer: React.FunctionComponent<{
  layer: LayerData;
  onLayerClose: (layerId: string) => void;
}> = ({ layer, onLayerClose }) => {
  const closeLayer = useCallback(() => onLayerClose(layer.id), [layer.id, onLayerClose]);

  return (
    <GrommetLayer onEsc={closeLayer} onClickOutside={closeLayer} position="top">
      <Box pad="large">
        <Heading color="red" level="3">
          {layer.title}
        </Heading>
        <Paragraph size="small">
          {layer.description.split('\n').map((line, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={i}>
              <Text size="small">{line}</Text>
              <br />
            </React.Fragment>
          ))}
        </Paragraph>
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
