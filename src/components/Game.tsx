import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BucketPosition, BucketType } from '../@types';
import { move, touch } from '../store/actions/rule-row';
import Board from './Board';
import {
  boardObjectsSelector,
  boardObjectToBucketsSelector,
  disabledBucketSelector,
  gameStartedSelector,
  pausedSelector,
} from '../store/selectors';
import { RootAction } from '../store/actions';
import { Dispatch } from 'redux';

type GameProps = {
  className?: string;
};

const Game = ({ className }: GameProps): JSX.Element => {
  const dispatch: Dispatch<RootAction> = useDispatch();

  const disabledBucket = useSelector(disabledBucketSelector);
  const boardObjects = useSelector(boardObjectsSelector);
  const boardObjectsToBuckets = useSelector(boardObjectToBucketsSelector);
  const gameStarted = useSelector(gameStartedSelector);
  const paused = useSelector(pausedSelector);
  const handleBoardObjectClick = useCallback((boardObject) => dispatch(touch(boardObject.id)), [
    dispatch,
  ]);

  return gameStarted ? (
    <Board
      className={className}
      onBoardObjectClick={handleBoardObjectClick}
      boardObjects={boardObjects}
      boardObjectsToBuckets={boardObjectsToBuckets}
      paused={paused}
      disabledBucket={disabledBucket}
      onDrop={(bucket: BucketType) => (droppedItem): void => {
        dispatch(move({ dragged: droppedItem.id, dropped: bucket.pos }));
      }}
    />
  ) : (
    <div>Loading...</div>
  );
};

export default Game;
