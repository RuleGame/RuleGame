import React, { useEffect, useReducer, useRef } from 'react';
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

type State = {
  droppedObjectId: number;
  boardObjects: BoardObjectType[];
};

type Action =
  | { type: 'RESET'; boardObjects: BoardObjectType[] }
  | { type: 'REMOVE_OBJECT'; id: BoardObjectId };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'RESET':
      return {
        droppedObjectId: -1,
        boardObjects: [...action.boardObjects],
      };
    case 'REMOVE_OBJECT':
      return {
        ...state,
        boardObjects: state.boardObjects.filter((boardObject) => boardObject.id !== action.id),
      };
    default:
      return state;
  }
};

type BoardProps = {
  onComplete: (log: Log) => void;
  initialBoardObjects: BoardObjectType[];
  className?: string;
  id: number;
};

const Board = ({ onComplete, initialBoardObjects, className, id }: BoardProps): JSX.Element => {
  const ref = useRef<{
    touchAttempts: BoardObjectId[];
    droppedBucket: BucketPosition | undefined;
    dropAttempts: DropAttempt[];
  }>({
    droppedBucket: undefined,
    dropAttempts: [],
    touchAttempts: [],
  });

  const [state, dispatch] = useReducer(reducer, {
    droppedObjectId: -1,
    boardObjects: initialBoardObjects,
  });

  const { droppedObjectId, boardObjects } = state;

  useEffect(() => {
    dispatch({ type: 'RESET', boardObjects: initialBoardObjects });
    ref.current = {
      droppedBucket: undefined,
      dropAttempts: [],
      touchAttempts: [],
    };
  }, [initialBoardObjects]);

  return (
    <StyledBoard className={className}>
      {boardObjects.map((boardObject) => (
        <StyledBoardObject
          {...boardObject}
          key={`${boardObject.x}-${boardObject.y}`}
          item={{ ...boardObject, type: 'object' }}
          onClick={() =>
            !ref.current.droppedBucket && ref.current.touchAttempts.push(boardObject.id)
          }
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
            if (ref.current.droppedBucket) {
              return;
            }
            const { current } = ref;
            current.dropAttempts.push({ dragged: droppedItem.id, dropped: bucketCoord.pos });

            // Don't put in canDrop because we want to bait the user to dropping items.
            // (The cursor will change to the drop cursor.)
            if (droppedItem.buckets.has(bucketCoord.pos)) {
              dispatch({ type: 'REMOVE_OBJECT', id: droppedItem.id });
              current.droppedBucket = bucketCoord.pos;

              onComplete({
                id,
                dropAttempts: current.dropAttempts,
                touchAttempts: current.touchAttempts,
                dropSuccess: current.dropAttempts[current.dropAttempts.length - 1],
              });
            }
          }}
          // Don't allow dropping when an object has been dropped for this table.
          canDrop={(): boolean => droppedObjectId === -1}
          dropped={ref.current.droppedBucket === bucketCoord.pos}
        />
      ))}
    </StyledBoard>
  );
};

export default Board;
