import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  BoardObjectId,
  BoardObjectItem,
  BoardObjectType,
  BucketPosition,
  BucketType,
  DropAttempt,
  Log,
} from '../@types';
import { bucketCoords, cols, rows } from '../constants';
import BoardObject from './BoardObject';
import Bucket from './Bucket';

const StyledBoard = styled.div<{}>`
  display: grid;
  grid-template-rows: repeat(${rows}, 1fr);
  grid-template-columns: repeat(${cols}, 1fr);
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
  onComplete: (log: Log) => void;
  boardObjects: BoardObjectType[];
  className?: string;
  id: number;
  pause: boolean;
  droppedBucket: BucketPosition | undefined;
};

const Board = ({
  onComplete,
  boardObjects,
  className,
  id,
  pause,
  droppedBucket,
}: BoardProps): JSX.Element => {
  const ref = useRef<{
    touchAttempts: BoardObjectId[];
    dropAttempts: DropAttempt[];
  }>({
    dropAttempts: [],
    touchAttempts: [],
  });

  useEffect(() => {
    ref.current = {
      dropAttempts: [],
      touchAttempts: [],
    };
  }, []);

  return (
    <StyledBoard className={className}>
      {boardObjects.map((boardObject) => (
        <StyledBoardObject
          {...boardObject}
          key={`${boardObject.x}-${boardObject.y}`}
          item={{ ...boardObject, type: 'object' }}
          onClick={() => !droppedBucket && ref.current.touchAttempts.push(boardObject.id)}
          canDrag={boardObject.draggable}
        />
      ))}
      {/* TODO: useCallback cannot be used in a callback (abstract the map return JSX) */}
      {bucketCoords.map((bucketCoord) => (
        <StyledBucket
          {...bucketCoord}
          key={`${bucketCoord.x}-${bucketCoord.y}`}
          onDrop={(
            droppedItem: BoardObjectItem,
            // @ts-ignore (Should really be void but the defined return type is undefined.)
          ): undefined => {
            if (droppedBucket) {
              return;
            }
            const { current } = ref;
            current.dropAttempts.push({ dragged: droppedItem.id, dropped: bucketCoord.pos });

            // Don't put in canDrop because we want to bait the user to dropping items.
            // (The cursor will change to the drop cursor.)
            if (droppedItem.buckets.has(bucketCoord.pos)) {
              onComplete({
                id,
                dropAttempts: current.dropAttempts,
                touchAttempts: current.touchAttempts,
                dropSuccess: current.dropAttempts[current.dropAttempts.length - 1],
              });
            }
          }}
          canDrop={() => !pause}
          dropped={droppedBucket === bucketCoord.pos}
        />
      ))}
    </StyledBoard>
  );
};

export default Board;
