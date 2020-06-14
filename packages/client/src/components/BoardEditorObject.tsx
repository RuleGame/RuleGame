import React from 'react';
import { Box, DropButton, Text } from 'grommet';
import ShapeObject from './ShapeObject';
import { BoardObjectType, Color, Shape } from '../@types';
import { positionToXy } from '../utils/atom-match';
import BoardEditorObjectGridSelect from './BoardEditorObjectGridSelect';

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
        <BoardEditorObjectGridSelect
          onClose={() => {
            setOpen(false);
          }}
          onDelete={() => {
            onChange(undefined);
            setOpen(false);
          }}
          onChange={onChange}
          pos={pos}
          boardObject={boardObject}
        />
      }
    />
  );
};

export default BoardEditorObject;
