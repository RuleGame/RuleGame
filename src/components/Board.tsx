import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { BoardObjectType, BucketType, Item } from '../@types';
import { bucketCoords, cols, rows, initialBoardObjects, afterDragTimeout } from '../constants';
import BoardObject from './BoardObject';
import Bucket from './Bucket';

const StyledBoard = styled('div')`
  display: grid;
  grid-template-rows: repeat(${rows}, 1fr);
  grid-template-columns: repeat(${cols}, 1fr);
  width: 100vw;
  height: 100vh;
`;

const StyledBoardObject = styled(BoardObject)<BoardObjectType>`
  grid-column: ${(boardObject) => boardObject.x + 1};
  grid-row: ${(boardObject) => rows - boardObject.y};
  background-color: ${(boardObject) => boardObject.color};
`;

const StyledBucket = styled(Bucket)<BucketType>`
  grid-column: ${(bucketCoord) => bucketCoord.x + 1};
  grid-row: ${(bucketCoord) => rows - bucketCoord.y};
  background-color: red;
`;

const Board = () => {
  const [droppedObjectId, setDroppedObjectId] = useState(-1);
  const [boardObjects, setBoardObjects] = useState(initialBoardObjects);
  let smileyTimeout = -1;
  useEffect(() => {
    return () => clearTimeout(smileyTimeout);
  }, [smileyTimeout]);

  return (
    <StyledBoard>
      {boardObjects.map((boardObject) => (
        <StyledBoardObject
          {...boardObject}
          key={`${boardObject.x}-${boardObject.y}`}
          item={{ buckets: boardObject.buckets, type: 'object', id: boardObject.id }}
        />
      ))}
      {bucketCoords.map((bucketCoord) => (
        <StyledBucket
          {...bucketCoord}
          key={`${bucketCoord.x}-${bucketCoord.y}`}
          onDrop={(
            item: Item,
            // @ts-ignore (Should really be void but the defined return type is undefined.)
          ): undefined => {
            setBoardObjects(
              boardObjects.map((boardObject) =>
                boardObject.id === item.id ? { ...boardObject, shape: 'happy' } : boardObject,
              ),
            );
            setDroppedObjectId(item.id);

            smileyTimeout = setTimeout(() => {
              setBoardObjects(
                boardObjects.filter((boardObject) => boardObject.id !== droppedObjectId),
              );
              setDroppedObjectId(-1);
            }, afterDragTimeout);
          }}
          // Don't allow dropping when an object has been dropped for this table.
          canDrop={(item): boolean => droppedObjectId === -1 && item.buckets.has(bucketCoord.pos)}
        />
      ))}
    </StyledBoard>
  );
};

export default Board;
