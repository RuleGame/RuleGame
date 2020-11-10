import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Box, Grid } from 'grommet';
import { useMeasure } from 'react-use';
import { BucketType } from '../@types';
import { buckets, cols, rows } from '../constants';
import BoardObject from './BoardObject';
import Bucket from './Bucket';
import BucketDropList from './BucketDropList';
import {
  boardObjectsSelector,
  bucketShapesSelector,
  displayBucketDropListsSelector,
  moveNumByBoardObjectSelector,
} from '../store/selectors/board';
import { BoardObject as BoardObjectType } from '../utils/api';
import { BucketPosition } from '../constants/BucketPosition';

const StyledBoard = styled.div<{}>`
  display: grid;
  grid-template-rows: repeat(${rows}, ${100 / rows}%);
  grid-template-columns: repeat(${cols}, ${100 / cols}%);
  height: 100%;
  width: 100%;
  position: relative;
  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

const StyledBoardObject = styled(BoardObject)<BoardObjectType>`
  grid-column: ${(boardObject) => boardObject.x + 1};
  grid-row: ${(boardObject) => rows - boardObject.y};
`;

const StyledBucket = styled(Bucket)<BucketType>`
  grid-column: ${(bucketCoord) => bucketCoord.x + 1};
  grid-row: ${(bucketCoord) => rows - bucketCoord.y};
`;

type BoardProps = {
  className?: string;
  paused: boolean;
};

enum GridAreaName {
  TL = 'TL',
  TR = 'TR',
  BL = 'BL',
  BR = 'BR',
  BOARD = 'BOARD',
}

const Board = ({ className }: BoardProps): JSX.Element => {
  const moveNumByBoardObject = useSelector(moveNumByBoardObjectSelector);
  const bucketShapes = useSelector(bucketShapesSelector);
  const boardObjects = useSelector(boardObjectsSelector);
  const displayBucketDropLists = useSelector(displayBucketDropListsSelector);
  const [ref, { height }] = useMeasure();

  return (
    <Box justify="center" align="center" ref={ref} fill>
      <Grid
        // fill="vertical"
        style={{ width: `${height}px`, height: `${height}px` }}
        className={className}
        rows={['10%', '40%', '40%', '10%']}
        columns={['10%', '80%', '10%']}
        areas={[
          {
            name: GridAreaName.TL,
            start: [0, 0],
            end: [0, 1],
          },
          {
            name: GridAreaName.TR,
            start: [2, 0],
            end: [2, 1],
          },
          {
            name: GridAreaName.BL,
            start: [0, 2],
            end: [0, 3],
          },
          {
            name: GridAreaName.BR,
            start: [2, 2],
            end: [2, 3],
          },
          {
            name: GridAreaName.BOARD,
            start: displayBucketDropLists ? [1, 1] : [0, 0],
            end: displayBucketDropLists ? [1, 2] : [2, 3],
          },
        ]}
      >
        {displayBucketDropLists && (
          <>
            <Box gridArea={GridAreaName.TL} fill justify="center" align="center">
              <BucketDropList bucket={BucketPosition.TL} />
            </Box>
            <Box gridArea={GridAreaName.TR} fill justify="center" align="center">
              <BucketDropList bucket={BucketPosition.TR} />
            </Box>
            <Box gridArea={GridAreaName.BL} fill justify="center" align="center">
              <BucketDropList bucket={BucketPosition.BL} />
            </Box>
            <Box gridArea={GridAreaName.BR} fill justify="center" align="center">
              <BucketDropList bucket={BucketPosition.BR} />
            </Box>
          </>
        )}

        <Box gridArea={GridAreaName.BOARD} pad="xxsmall">
          <StyledBoard>
            {boardObjects.map((boardObject) => (
              <StyledBoardObject
                {...boardObject}
                key={boardObject.id}
                moveNum={moveNumByBoardObject[boardObject.id]}
                boardObject={boardObject}
              />
            ))}
            {buckets.map((bucket) => (
              <StyledBucket
                {...bucket}
                key={`${bucket.x}-${bucket.y}`}
                shape={bucketShapes[bucket.pos]}
                bucket={bucket}
              />
            ))}
          </StyledBoard>
        </Box>
      </Grid>
    </Box>
  );
};

export default Board;
