import React, { useState } from 'react';
import { Box, BoxProps, Button, Grid } from 'grommet';
import range from 'lodash/range';
import { BoardObjectType, Shape } from '../@types/index';
import { cols, rows } from '../constants';
import { xYToPosition } from '../utils/atom-match';
import BoardEditorObject from './BoardEditorObject';
import ShapeObject from './ShapeObject';

const indexToPos = (index: number) =>
  (rows - 2) * (cols - 2) -
  Math.floor(index / (cols - 2)) * (cols - 2) +
  (index % (cols - 2)) -
  (cols - 2) +
  1;

const BoardEditor: React.FunctionComponent<{
  boardObjects?: BoardObjectType[];
  onLoad: (boardObjectsArray: BoardObjectType[]) => void;
  width?: BoxProps['width'];
  height?: BoxProps['height'];
}> = ({ boardObjects = [], onLoad, width = 'min(70vh, 100vw)', height = 'min(70vh, 100vw)' }) => {
  const [boardObjectsByPos, setBoardObjectByPos] = useState<{
    [pos: number]: BoardObjectType | undefined;
  }>(() =>
    boardObjects.reduce((acc, curr) => ({ ...acc, [xYToPosition(curr.x, curr.y)]: curr }), {}),
  );

  return (
    <Grid fill rows={['auto', 'min-content']}>
      <Box width={width} height={height}>
        <Grid fill rows={['1fr', `${rows - 2}fr`, '1fr']} columns={['1fr', `${cols - 2}fr`, '1fr']}>
          {range(9).map((j) =>
            j === 4 ? (
              <Grid
                rows={range(rows - 2).map(() => '1fr')}
                columns={range(cols - 2).map(() => '1fr')}
                key={j}
              >
                {range((rows - 2) * (cols - 2)).map((i) => (
                  <BoardEditorObject
                    key={i}
                    pos={indexToPos(i)}
                    boardObject={boardObjectsByPos[indexToPos(i)]}
                    onChange={(boardObject) =>
                      setBoardObjectByPos((state) => ({
                        ...state,
                        [indexToPos(i)]: boardObject,
                      }))
                    }
                  />
                ))}
              </Grid>
            ) : j % 2 === 0 ? (
              <Box fill border key={j}>
                <ShapeObject shape={Shape.BUCKET} />
              </Box>
            ) : (
              <Box fill border key={j} />
            ),
          )}
        </Grid>
      </Box>
      <Button
        label="Load"
        onClick={() =>
          onLoad(
            Object.values(boardObjectsByPos).filter((b): b is BoardObjectType => b !== undefined),
          )
        }
      />
    </Grid>
  );
};

export default BoardEditor;
