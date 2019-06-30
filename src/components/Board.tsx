import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BoardObjectId,
  BoardObjectItem,
  BoardObjectType,
  BucketType,
  Log,
  DropAttempt,
} from '../@types';
import { afterDragTimeout, bucketCoords, cols, rows } from '../constants';
import BoardObject from './BoardObject';
import Bucket from './Bucket';

const StyledBoard = styled.div<{}>`
  display: grid;
  grid-template-rows: repeat(${rows}, 1fr);
  grid-template-columns: repeat(${cols}, 1fr);
  width: 100vh;
  max-width: 100vw;
  height: 100vw;
  max-height: 100vh;
`;

const StyledBoardObject = styled(BoardObject)<BoardObjectType>`
  grid-column: ${(boardObject) => boardObject.x + 1};
  grid-row: ${(boardObject) => rows - boardObject.y};
  color: ${(boardObject) => boardObject.color};
`;

const StyledBucket = styled(Bucket)<BucketType>`
  grid-column: ${(bucketCoord) => bucketCoord.x + 1};
  grid-row: ${(bucketCoord) => rows - bucketCoord.y};
  background-color: red;
`;

type BoardProps = {
  onComplete: (log: Log) => void;
  initialBoardObjects: BoardObjectType[];
};

const Board = ({ onComplete, initialBoardObjects }: BoardProps): JSX.Element => {
  const [droppedObjectId, setDroppedObjectId] = useState(-1);
  const [boardObjects, setBoardObjects] = useState(initialBoardObjects);
  const [touchedObjects, setTouchedObjects] = useState([] as BoardObjectId[]);
  const [dropAttempts, setDropAttempts] = useState([] as DropAttempt[]);

  useEffect(() => {
    if (droppedObjectId !== -1) {
      const smileyTimeout = setTimeout(() => {
        onComplete({ dropAttempts, touchedObjects });
      }, afterDragTimeout);
      return () => clearTimeout(smileyTimeout);
    }
    return undefined;
  }, [droppedObjectId, touchedObjects, dropAttempts, onComplete]);

  useEffect(() => {
    setBoardObjects(initialBoardObjects);
    setDroppedObjectId(-1);
  }, [initialBoardObjects]);

  return (
    <StyledBoard>
      {boardObjects.map((boardObject) => (
        <StyledBoardObject
          {...boardObject}
          key={`${boardObject.x}-${boardObject.y}`}
          item={{ ...boardObject, type: 'object' }}
          onClick={() => setTouchedObjects([...touchedObjects, boardObject.id])}
        />
      ))}
      {bucketCoords.map((bucketCoord) => (
        <StyledBucket
          {...bucketCoord}
          key={`${bucketCoord.x}-${bucketCoord.y}`}
          onDrop={(
            droppedItem: BoardObjectItem,
            // @ts-ignore (Should really be void but the defined return type is undefined.)
          ): undefined => {
            setDropAttempts([
              ...dropAttempts,
              { dragged: droppedItem.id, dropped: bucketCoord.pos },
            ]);

            // Don't put in canDrop because we want to bait the user to dropping items.
            // (The cursor will change to the drop cursor.)
            if (droppedItem.buckets.has(bucketCoord.pos)) {
              // Turn the object to a happy face.
              setBoardObjects(
                boardObjects.map((boardObject) =>
                  boardObject.id === droppedItem.id
                    ? { ...boardObject, shape: 'happy' }
                    : boardObject,
                ),
              );
              setDroppedObjectId(droppedItem.id);
            }
          }}
          // Don't allow dropping when an object has been dropped for this table.
          canDrop={(): boolean => droppedObjectId === -1}
        />
      ))}
    </StyledBoard>
  );
};

export default Board;
