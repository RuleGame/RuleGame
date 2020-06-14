import React from 'react';
import { Box, Button, Grid, RadioButton, Text } from 'grommet';
import { Close, Trash } from 'grommet-icons';
import range from 'lodash/range';
import { colors, shapes } from '../constants';
import { positionToXy } from '../utils/atom-match';
import ShapeObject from './ShapeObject';
import { BoardObjectType } from '../@types';

export enum GridArea {
  RADIO_BUTTONS = 'RADIO_BUTTONS',
  COLORS = 'COLORS',
  SHAPES = 'SHAPES',
}

const BoardEditorObjectGridSelect: React.FunctionComponent<{
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
        <Grid
          rows={['auto', 'auto']}
          columns={['auto', 'auto']}
          areas={[
            {
              name: GridArea.COLORS,
              start: [1, 0],
              end: [1, 0],
            },
            {
              name: GridArea.SHAPES,
              start: [0, 1],
              end: [0, 1],
            },
            {
              name: GridArea.RADIO_BUTTONS,
              start: [1, 1],
              end: [1, 1],
            },
          ]}
        >
          <Box gridArea={GridArea.COLORS} direction="row" justify="stretch">
            {colors.map((color) => (
              <Box justify="center" align="center" fill>
                <Text>{color}</Text>
              </Box>
            ))}
          </Box>
          <Box gridArea={GridArea.SHAPES} direction="column" justify="stretch">
            {shapes.map((shape) => (
              <Box justify="center" align="center" fill>
                <Text>{shape}</Text>
              </Box>
            ))}
          </Box>
          <Grid
            columns={{
              count: shapes.length,
              size: 'auto',
            }}
            gridArea={GridArea.RADIO_BUTTONS}
            gap="xxsmall"
          >
            {range(colors.length * shapes.length).map((i) => {
              const color = colors[i % colors.length];
              const shape = shapes[Math.floor(i / colors.length)];
              const name = `${color}-${shape}`;

              return (
                <Box justify="center" align="center" border="all">
                  <RadioButton
                    name={name}
                    key={name}
                    onChange={() => {
                      if (onChange) {
                        onChange({
                          color,
                          shape,
                          id: String(pos),
                          x: positionToXy(pos).x,
                          y: positionToXy(pos).y,
                        });
                      }
                    }}
                    checked={boardObject?.color === color && boardObject?.shape === shape}
                    label={
                      // eslint-disable-next-line react/jsx-wrap-multilines
                      <Box height="xxsmall" width="xxsmall" justify="center" align="center">
                        <ShapeObject shape={shape} color={color} />
                      </Box>
                    }
                  />
                </Box>
              );
            })}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default BoardEditorObjectGridSelect;
