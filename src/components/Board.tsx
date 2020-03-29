import React from 'react';
import styled from 'styled-components';
import { BoardObjectItem, BoardObjectType, BucketPosition, BucketType } from '../@types';
import { buckets, cols, rows } from '../constants';
import BoardObject from './BoardObject';
import Bucket from './Bucket';

const StyledBoard = styled.div<{}>`
  display: grid;
  grid-template-rows: repeat(${rows}, ${100 / rows}%);
  grid-template-columns: repeat(${cols}, ${100 / cols}%);
  height: min(70vh, 100vw);
  width: min(70vh, 100vw);
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
  disabledBucket: BucketPosition | undefined;
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
  disabledBucket,
  boardObjectsToDebugInfo,
}: BoardProps): JSX.Element => {
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
          onClick={() => !disabledBucket && onBoardObjectClick(boardObject)}
        />
      ))}
      {buckets.map((bucket) => (
        <StyledBucket
          {...bucket}
          key={`${bucket.x}-${bucket.y}`}
          onDrop={onDrop(bucket)}
          canDrop={() => !paused}
          dropped={disabledBucket === bucket.pos}
          bucket={bucket}
        />
      ))}
    </StyledBoard>
  );
};

export default Board;
