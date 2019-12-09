import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CheckBox } from 'grommet';
import styled from 'styled-components';
import { Dispatch } from 'redux';
import { BoardObjectItem, BucketType } from '../@types';
import { disableDebugMode, enableDebugMode, move, touch } from '../store/actions/rule-row';
import Board from './Board';
import {
  boardObjectsSelector,
  boardObjectsToDebugInfoSelector,
  boardObjectToBucketsSelector,
  debugModeSelector,
  disabledBucketSelector,
  gameCompletedSelector,
  historyDebugInfoSelector,
  pausedSelector,
  rawAtomsSelector,
  ruleRowIndexSelector,
} from '../store/selectors';
import { RootAction } from '../store/actions';
import { goToPage } from '../store/actions/page';

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

const StyledRawAtoms = styled('div')<{}>`
  display: flex;
  flex-direction: column;
  font-size: 0.75em;
  height: 80vh;
  overflow: auto;
`;

const StyledRawAtom = styled('div')<{ highlighted: boolean }>`
  background-color: ${({ highlighted }) => (highlighted ? 'yellow' : 'none')};
`;

type GameProps = {
  className?: string;
};

const Game = ({ className }: GameProps): JSX.Element => {
  const dispatch: Dispatch<RootAction> = useDispatch();

  const disabledBucket = useSelector(disabledBucketSelector);
  const boardObjects = useSelector(boardObjectsSelector);
  const boardObjectsToBuckets = useSelector(boardObjectToBucketsSelector);
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
  const ruleRowIndex = useSelector(ruleRowIndexSelector);
  const rawAtoms = useSelector(rawAtomsSelector);
  const gameCompleted = useSelector(gameCompletedSelector);
  const handleFinishedClick = useCallback(() => dispatch(goToPage('Entrance')), [dispatch]);

  return (
    <>
      <CheckBox checked={debugModeEnabled} label="Debug Mode" onChange={handleDebugModeChange} />
      <StyledGame>
        {debugModeEnabled && (
          <StyledRawAtoms>
            {rawAtoms.map((rawAtom, i) => (
              <StyledRawAtom key={rawAtom} highlighted={ruleRowIndex === i}>
                {rawAtom}
              </StyledRawAtom>
            ))}
          </StyledRawAtoms>
        )}
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
              dropAttemptString.split('\n').map((item) => {
                return <div key={item}>{item}</div>;
              }),
            )}
          </StyledLog>
        )}
      </StyledGame>
      {gameCompleted && (
        <div>
          No more moves left!
          <br />
          <Button label="Finish" onClick={handleFinishedClick} />
        </div>
      )}
    </>
  );
};

export default Game;
