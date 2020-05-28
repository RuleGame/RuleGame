import React from 'react';
import { DropButton, Box, RadioButton, Text, Button } from 'grommet';
import { Close, Trash } from 'grommet-icons';
import { colors, shapes } from '../constants';
import ShapeObject from './ShapeObject';
import { Shape, Color, BoardObjectType } from '../@types';
import { positionToXy } from '../utils/atom-match';

const BoardEditorObject: React.FunctionComponent<{
  pos: number;
  boardObject?: BoardObjectType;
  onChange: (boardObject: BoardObjectType | undefined) => void;
}> = ({ pos, boardObject, onChange }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropButton
      fill
      plain
      onOpen={() => {
        setOpen(true);
        if (!boardObject) {
          onChange({
            color: Color.RED,
            shape: Shape.SQUARE,
            id: String(pos),
            x: positionToXy(pos).x,
            y: positionToXy(pos).y,
          });
        }
      }}
      onClose={() => setOpen(false)}
      open={open}
      label={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <Box fill align="center" justify="center" border>
          {boardObject ? (
            <ShapeObject color={boardObject.color} shape={boardObject.shape} />
          ) : (
            <Text>{pos}</Text>
          )}
        </Box>
      }
      dropAlign={{ top: 'bottom', left: 'left' }}
      dropContent={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <Box background="ligh-2" gap="small" pad="small">
          <Box direction="row">
            <Box border={{ side: 'bottom' }} pad="small" fill="horizontal">
              <Button
                label="Delete"
                icon={<Trash />}
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              />
            </Box>
            <Box>
              <Button icon={<Close />} onClick={() => setOpen(false)} />
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
      }
    />
  );
};

export default BoardEditorObject;
