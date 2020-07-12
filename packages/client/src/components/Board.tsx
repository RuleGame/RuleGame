import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { BoardObjectItem, BoardObjectType, BucketPosition, BucketType, Shape } from '../@types';
import { buckets, cols, rows } from '../constants';
import BoardObject from './BoardObject';
import Bucket from './Bucket';
import { droppedBucketSelector } from '../store/selectors';

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

  return (
    <StyledBoard className={className}>
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
  );
};

export default Board;
