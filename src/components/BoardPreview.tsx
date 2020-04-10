import React, { useMemo } from 'react';
import { Grid, Box, BoxProps, Text, Button } from 'grommet';
import range from 'lodash/range';
import stringify from 'json-stringify-pretty-compact';
import { useDispatch } from 'react-redux';
import { rows, cols } from '../constants';
import ShapeObject from './ShapeObject';
import { Shape, BoardObjectType } from '../@types/index';
import { xYToPosition } from '../utils/atom-match';
import { addLayer } from '../store/actions/layers';

const indexToPos = (index: number) =>
  (rows - 2) * (cols - 2) -
  Math.floor(index / (cols - 2)) * (cols - 2) +
  (index % (cols - 2)) -
  (cols - 2);

const BoardPreview: React.FunctionComponent<{
  boardObjects: BoardObjectType[];
  width?: BoxProps['width'];
  height?: BoxProps['height'];
}> = ({ boardObjects, width = 'min(70vh, 100vw)', height = 'min(70vh, 100vw)' }) => {
  const boardObjectByPos = useMemo(
    () =>
      boardObjects.reduce(
        (acc, curr) => ({ ...acc, [xYToPosition(curr.x, curr.y)]: curr }),
        {} as { [pos: number]: BoardObjectType | undefined },
      ),
    [boardObjects],
  );
  const dispatch = useDispatch();

  return (
    <Box>
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
                  <Box fill align="center" justify="center" border key={i}>
                    {boardObjectByPos[indexToPos(i)] ? (
                      <ShapeObject
                        color={(boardObjectByPos[indexToPos(i)] as BoardObjectType).color}
                        shape={(boardObjectByPos[indexToPos(i)] as BoardObjectType).shape}
                      />
                    ) : (
                      <Text>{indexToPos(i)}</Text>
                    )}
                  </Box>
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
        label="Export"
        onClick={() =>
          dispatch(
            addLayer(
              'Board Objects Array:',
              <Box>
                {stringify(boardObjects, { maxLength: 20 })
                  .replace(/ /g, '\u00A0')
                  .split('\n')
                  .map((s) => (
                    <Text>{s}</Text>
                  ))}
              </Box>,
              [],
            ),
          )
        }
      />
    </Box>
  );
};

export default BoardPreview;
