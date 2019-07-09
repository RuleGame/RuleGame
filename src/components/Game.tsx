import React, { useContext, useMemo, useRef, useState } from 'react';
import {
  BoardObjectId,
  BoardObjectType,
  BucketPosition,
  BucketType,
  DropAttempt,
} from '../@types/index';
import { afterDragTimeout } from '../constants';
import Board from './Board';
import { GameDispatch } from '../contexts/game';

type GameProps = {
  className?: string;
  boardObjectsById: { [id: number]: BoardObjectType };
};

const Game = ({ className, boardObjectsById }: GameProps): JSX.Element => {
  // Won't cause an update.
  const ref = useRef<{
    touchAttempts: BoardObjectId[];
    dropAttempts: DropAttempt[];
  }>({
    dropAttempts: [],
    touchAttempts: [],
  });

  const dispatch = useContext(GameDispatch);

  const [pause, setPause] = useState<boolean>(false);
  const [disabledBucket, setDroppedBucket] = useState<BucketPosition | undefined>(undefined);

  const makeMove = (
    touchAttempts: BoardObjectId[],
    dropAttempts: DropAttempt[],
    dropSuccess: DropAttempt,
  ) => dispatch({ type: 'MOVE', touchAttempts, dropAttempts, dropSuccess });
  const updateBoardObject = (id: number, boardObject: Partial<BoardObjectType>) =>
    dispatch({ type: 'UPDATE_BOARD_OBJECT', id, boardObject });

  return (
    <Board
      className={className}
      onBoardObjectClick={(boardObject) => ref.current.touchAttempts.push(boardObject.id)}
      boardObjects={useMemo(() => Object.values(boardObjectsById), [boardObjectsById])}
      pause={pause}
      disabledBucket={disabledBucket}
      onDrop={(bucket: BucketType) => (droppedItem): void => {
        if (disabledBucket) {
          return;
        }
        const { current } = ref;
        current.dropAttempts.push({ dragged: droppedItem.id, dropped: bucket.pos });

        // Don't put in canDrop because we want to bait the user to dropping items.
        // (The cursor will change to the drop cursor.)
        if (droppedItem.buckets.has(bucket.pos)) {
          const { current } = ref;
          const dropSuccess = current.dropAttempts[current.dropAttempts.length - 1];
          updateBoardObject(dropSuccess.dragged, {
            shape: 'check',
            draggable: false,
          });
          setPause(true);
          setDroppedBucket(dropSuccess.dropped);
          setTimeout(() => {
            setPause(false);
            setDroppedBucket(undefined);
            makeMove(ref.current.touchAttempts, ref.current.dropAttempts, dropSuccess);
            ref.current.touchAttempts = [];
            ref.current.dropAttempts = [];
          }, afterDragTimeout);
        }
      }}
    />
  );
};

export default Game;
