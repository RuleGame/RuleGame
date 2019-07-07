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
  onDrop: (bucketCoord: BucketType) => (droppedItem: BoardObjectItem) => void;
  boardObjects: BoardObjectType[];
  className?: string;
  pause: boolean;
  disabledBucket: BucketPosition | undefined;
};

const Board = ({
  onDrop,
  boardObjects,
  className,
  pause,
  disabledBucket,
}: BoardProps): JSX.Element => {

  return (
    <StyledBoard className={className}>
      {boardObjects.map((boardObject) => (
        <StyledBoardObject
          {...boardObject}
          key={`${boardObject.x}-${boardObject.y}`}
          item={{ ...boardObject, type: 'object' }}
          onClick={() => !disabledBucket && ref.current.touchAttempts.push(boardObject.id)}
          canDrag={boardObject.draggable}
        />
      ))}
      {/* TODO: useCallback cannot be used in a callback (abstract the map return JSX) */}
      {bucketCoords.map((bucketCoord) => (
        <StyledBucket
          {...bucketCoord}
          key={`${bucketCoord.x}-${bucketCoord.y}`}
          onDrop={onDrop(bucketCoord)}
          canDrop={() => !pause}
          dropped={disabledBucket === bucketCoord.pos}
        />
      ))}
    </StyledBoard>
  );
};

export default Board;
