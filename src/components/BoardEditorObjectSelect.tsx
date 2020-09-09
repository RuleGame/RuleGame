import React from 'react';
import { Box, Button, RadioButton, Text } from 'grommet';
import { Close, Trash } from 'grommet-icons';
import { colors, shapes } from '../constants';
import { positionToXy } from '../utils/atom-match';
import ShapeObject from './ShapeObject';
import { BoardObjectType } from '../@types';

const BoardEditorObjectSelect: React.FunctionComponent<{
  onDelete: () => void;
  onClose: () => void;
  onChange: (boardObject: BoardObjectType | undefined) => void;
  pos: number;
  boardObject?: BoardObjectType;
}> = ({ onClose, onDelete, onChange, boardObject, pos }) => {
  return (
    <Box gap="small" pad="small">
      <Box direction="row">
        <Box border={{ side: 'bottom' }} pad="small" fill="horizontal">
          <Button label="Delete" icon={<Trash />} onClick={onDelete} />
        </Box>
        <Box>
          <Button icon={<Close />} onClick={onClose} />
        </Box>
      </Box>
      {boardObject && (
        <Box direction="row">
          <Box border={{ side: 'bottom' }} pad="small" gap="small">
            {colors.map((color) => (
              <RadioButton
                name={color}
                label={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <Box
                    width="xsmall"
                    round
                    pad="xxsmall"
                    justify="center"
                    direction="row"
                    border={{ color, size: 'small' }}
                  >
                    <Text>{color}</Text>
                  </Box>
                }
                color={color}
                key={color}
                onChange={() => {
                  if (onChange) {
                    onChange({
                      color,
                      shape: boardObject.shape,
                      id: String(pos),
                      x: positionToXy(pos).x,
                      y: positionToXy(pos).y,
                    });
                  }
                }}
                checked={boardObject.color === color}
              />
            ))}
          </Box>
          <Box border={{ side: 'bottom' }} pad="small">
            {shapes.map((shape) => (
              <RadioButton
                name={shape}
                label={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <Box
                    width="xsmall"
                    height="xxsmall"
                    round
                    pad="xsmall"
                    justify="center"
                    direction="row"
                    align="center"
                  >
                    <Box fill>
                      <ShapeObject shape={shape} />
                    </Box>
                    <Text>{shape}</Text>
                  </Box>
                }
                key={shape}
                onChange={() => {
                  if (onChange) {
                    onChange({
                      color: boardObject.color,
                      shape,
                      id: String(pos),
                      x: positionToXy(pos).x,
                      y: positionToXy(pos).y,
                    });
                  }
                }}
                checked={boardObject.shape === shape}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BoardEditorObjectSelect;
