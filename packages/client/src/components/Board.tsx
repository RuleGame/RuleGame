import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Box, Grid } from 'grommet';
import { BoardObjectItem, BoardObjectType, BucketPosition, BucketType, Shape } from '../@types';
import { buckets, cols, rows } from '../constants';
import BoardObject from './BoardObject';
import Bucket from './Bucket';
import { checkedObjectsSelector, droppedBucketSelector } from '../store/selectors';
import BucketDropList from './BucketDropList';

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
  color: ${(boardObject) => boardObject.color};
`;

const StyledBucket = styled(Bucket)<BucketType>`
  grid-column: ${(bucketCoord) => bucketCoord.x + 1};
  grid-row: ${(bucketCoord) => rows - bucketCoord.y};
`;

type BoardProps = {
  onDrop: (bucketCoord: BucketType) => (droppedItem: BoardObjectItem) => void;
  boardObjects: BoardObjectType[];
  boardObjectsToBuckets: {
    [boardObjectId: string]: Set<BucketPosition>;
  };
  className?: string;
  paused: boolean;
  droppedBucketShape: Shape;
  onBoardObjectClick: (boardObject: BoardObjectType) => void;
  boardObjectsToDebugInfo?: { [boardObjectId: string]: string };
};

enum GridAreaName {
  TL = 'TL',
  TR = 'TR',
  BL = 'BL',
  BR = 'BR',
  BOARD = 'BOARD',
}

const Board = ({
  onDrop,
  boardObjects,
  boardObjectsToBuckets,
  className,
  paused,
  onBoardObjectClick,
  droppedBucketShape,
  boardObjectsToDebugInfo,
}: BoardProps): JSX.Element => {
  const droppedBucket = useSelector(droppedBucketSelector);
  const checkedObjects = useSelector(checkedObjectsSelector);

  return (
    <Grid
      className={className}
      fill
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
          start: [1, 1],
          end: [1, 2],
        },
      ]}
    >
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

      <Box gridArea={GridAreaName.BOARD}>
        <StyledBoard>
          {boardObjects.map((boardObject) => (
            <StyledBoardObject
              {...boardObject}
              key={`${boardObject.x}-${boardObject.y}`}
              item={{
                ...boardObject,
                type: 'object',
                buckets: boardObjectsToBuckets[boardObject.id],
                debugInfo: boardObjectsToDebugInfo && boardObjectsToDebugInfo[boardObject.id],
              }}
              onClick={() => !droppedBucket && onBoardObjectClick(boardObject)}
              checked={checkedObjects.has(boardObject.id)}
            />
          ))}
          {buckets.map((bucket) => (
            <StyledBucket
              {...bucket}
              key={`${bucket.x}-${bucket.y}`}
              onDrop={onDrop(bucket)}
              canDrop={() => !paused}
              shape={droppedBucket === bucket.pos ? droppedBucketShape : Shape.BUCKET}
              bucket={bucket}
            />
          ))}
        </StyledBoard>
      </Box>
    </Grid>
  );
};

export default Board;
