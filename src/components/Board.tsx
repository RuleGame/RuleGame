import React, { useEffect, useState, useReducer, Reducer } from 'react';
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
`;

const StyledBoardObject = styled(BoardObject)<BoardObjectType>`
  grid-column: ${(boardObject) => boardObject.x + 1};
  grid-row: ${(boardObject) => rows - boardObject.y};
  color: ${(boardObject) => boardObject.color};
`;

const StyledBucket = styled(Bucket)<BucketType>`
  grid-column: ${(bucketCoord) => bucketCoord.x + 1};
  grid-row: ${(bucketCoord) => rows - bucketCoord.y};
  color: red;
`;

type State = {
  droppedObjectId: number;
  boardObjects: BoardObjectType[];
  touchedObjects: BoardObjectId[];
  dropAttempts: DropAttempt[];
};

type Action =
  | { type: 'SET_BOARD_OBJECTS'; boardObjects: BoardObjectType[] }
  | { type: 'SET_DROPPED_OBJECT_ID'; droppedObjectId: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_BOARD_OBJECTS':
      return {
        ...state,
        boardObjects: action.boardObjects,
      };
    case 'SET_DROPPED_OBJECT_ID':
      return {
        ...state,
        droppedObjectId: action.droppedObjectId,
      };
    default:
      return state;
  }
};

type BoardProps = {
  onComplete: (log: Log) => void;
  initialBoardObjects: BoardObjectType[];
  className?: string;
};

const Board = ({ onComplete, initialBoardObjects, className }: BoardProps): JSX.Element => {
  const [droppedObjectId, setDroppedObjectId] = useState(-1);
  const [boardObjects, setBoardObjects] = useState(initialBoardObjects);
  const [touchedObjects, setTouchedObjects] = useState([] as BoardObjectId[]);
  const [dropAttempts, setDropAttempts] = useState([] as DropAttempt[]);

  const [state, dispatch] = useReducer(reducer, {
    droppedObjectId: -1,
    boardObjects: initialBoardObjects,
    touchedObjects: [],
    dropAttempts: [],
  });

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
    <StyledBoard className={className}>
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
              setBoardObjects(
                boardObjects.map((boardObject) =>
                  boardObject.id === droppedItem.id
                    ? { ...boardObject, shape: 'nothing' }
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
