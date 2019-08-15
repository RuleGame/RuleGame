import React, { useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  BoardObjectId,
  BoardObjectType,
  BucketPosition,
  BucketType,
  DropAttempt,
  Shape,
} from '../@types';
import { afterDragTimeout } from '../constants';
import { move, updateBoardObject } from '../store/actions/game';
import Board from './Board';

type GameProps = {
  className?: string;
  boardObjectsById: { [id: number]: BoardObjectType };
};

const Game = ({ className, boardObjectsById }: GameProps): JSX.Element => {
  const dispatch = useDispatch();
  // Won't cause an update.
  const ref = useRef<{
    touchAttempts: BoardObjectId[];
    dropAttempts: DropAttempt[];
  }>({
    dropAttempts: [],
    touchAttempts: [],
  });

  const [pause, setPause] = useState<boolean>(false);
  const [disabledBucket, setDroppedBucket] = useState<BucketPosition | undefined>(undefined);

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
          dispatch(
            updateBoardObject(dropSuccess.dragged, {
              shape: Shape.CHECK,
              draggable: false,
            }),
          );
          setPause(true);
          setDroppedBucket(dropSuccess.dropped);
          setTimeout(() => {
            setPause(false);
            setDroppedBucket(undefined);
            dispatch(move(ref.current.touchAttempts, ref.current.dropAttempts, dropSuccess));
            ref.current.touchAttempts = [];
            ref.current.dropAttempts = [];
          }, afterDragTimeout);
        }
      }}
    />
  );
};

export default Game;
