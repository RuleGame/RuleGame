import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'grommet';
import { BoardObjectItem, BucketPosition, BucketType } from '../@types';
import { disableDebugMode, enableDebugMode, move, touch } from '../store/actions/rule-row';
import Board from './Board';
import {
  boardObjectsSelector,
  boardObjectsToDebugInfoSelector,
  boardObjectToBucketsSelector,
  debugModeSelector,
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
  const boardObjectsToDebugInfo = useSelector(boardObjectsToDebugInfoSelector);
  const debugModeEnabled = useSelector(debugModeSelector);
  const handleDebugModeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        dispatch(enableDebugMode());
      } else {
        dispatch(disableDebugMode());
      }
    },
    [dispatch],
  );
  const handleDrop = useCallback(
    (bucket: BucketType) => (droppedItem: BoardObjectItem): void => {
      dispatch(move({ dragged: droppedItem.id, dropped: bucket.pos }));
    },
    [dispatch],
  );

  return gameStarted ? (
    <div>
      <Board
        className={className}
        onBoardObjectClick={handleBoardObjectClick}
        boardObjects={boardObjects}
        boardObjectsToBuckets={boardObjectsToBuckets}
        boardObjectsToDebugInfo={boardObjectsToDebugInfo}
        paused={paused}
        disabledBucket={disabledBucket}
        onDrop={handleDrop}
      />
      <CheckBox checked={debugModeEnabled} label="Debug Mode" onChange={handleDebugModeChange} />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Game;
