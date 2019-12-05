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
  historyDebugInfoSelector,
  pausedSelector,
} from '../store/selectors';
import { RootAction } from '../store/actions';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

const StyledGame = styled('div')<{}>`
  display: flex;
`;

const StyledLog = styled('div')<{}>`
  display: flex;
  flex-direction: column;
  font-size: 0.75em;
  height: 80vh;
  overflow: auto;
`;

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
  const historyDebugInfo = useSelector(historyDebugInfoSelector);

  return gameStarted ? (
    <>
      <CheckBox checked={debugModeEnabled} label="Debug Mode" onChange={handleDebugModeChange} />
      <StyledGame>
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
        {historyDebugInfo && (
          <StyledLog>
            History Log:
            {historyDebugInfo.map((dropAttemptString) =>
              dropAttemptString.split('\n').map((item, i) => {
                return <div key={i}>{item}</div>;
              }),
            )}
          </StyledLog>
        )}
      </StyledGame>
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default Game;
