import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, CheckBox, Grid, Heading, Text } from 'grommet';
import { Dispatch } from 'redux';
import { saveAs } from 'file-saver';
import { BoardObjectItem, BucketType } from '../@types';
import { disableDebugMode, enableDebugMode, move, touch } from '../store/actions/rule-row';
import Board from './Board';
import {
  allChecksSelector,
  boardObjectsSelector,
  boardObjectsToDebugInfoSelector,
  boardObjectToBucketsSelector,
  debugModeSelector,
  droppedBucketShapeSelector,
  gameCompletedSelector,
  historyDebugInfoSelector,
  noMoreDisplaysSelector,
  orderSelector,
  pausedSelector,
  rawAtomsSelector,
  ruleRowIndexSelector,
} from '../store/selectors';
import { RootAction } from '../store/actions';
import { goToPage } from '../store/actions/page';
import { nextBoardObjectsArray } from '../store/actions/game';
import GuessRuleForm from './GuessRuleForm';
import { CY_GAME, CY_NO_MORE_MOVES } from '../constants/data-cy';
import { DEBUG_ENABLED } from '../constants/env';
import { currGameIdSelector, currGameNameSelector } from '../store/selectors/rule-row';
import { historySelector } from '../store/selectors/history';
import { numDisplaysLeftSelector } from '../store/selectors/game';

enum GridAreaName {
  HEADING = 'HEADING',
  DEBUG_TOGGLE = 'DEBUG_TOGGLE',
  HISTORY = 'HISTORY',
  RULE_ARRAY = 'RULE_ARRAY',
  BOARD = 'BOARD',
  FORM = 'FORM',
}

const Game: React.FunctionComponent<{
  className?: string;
}> = ({ className }) => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const [submittedGuess, setSubmittedGuess] = useState(false);

  const droppedBucketShape = useSelector(droppedBucketShapeSelector);
  const boardObjects = useSelector(boardObjectsSelector);
  const boardObjectsToBuckets = useSelector(boardObjectToBucketsSelector);
  const paused = useSelector(pausedSelector);
  const boardObjectsToDebugInfo = useSelector(boardObjectsToDebugInfoSelector);
  const debugModeEnabled = useSelector(debugModeSelector);
  const historyDebugInfo = useSelector(historyDebugInfoSelector);
  const ruleRowIndex = useSelector(ruleRowIndexSelector);
  const rawAtoms = useSelector(rawAtomsSelector);
  // const gameCompleted = useSelector(gameCompletedSelector);
  const gameCompleted = true;
  const order = useSelector(orderSelector);
  const gameId = useSelector(currGameIdSelector);
  const allChecked = useSelector(allChecksSelector);
  const gameName = useSelector(currGameNameSelector);
  const history = useSelector(historySelector);
  const noMoreDisplays = useSelector(noMoreDisplaysSelector);
  const numDisplaysLeft = useSelector(numDisplaysLeftSelector);

  return (
    <Box pad="small" data-cy={CY_GAME}>
      <Grid
        rows={['auto', 'auto', 'min(70vh, 100vw)', 'auto']}
        columns={['auto', 'min(70vh, 100vw)', 'auto']}
        areas={[
          {
            name: GridAreaName.HEADING,
            start: [0, 0],
            end: [2, 0],
          },
          {
            name: GridAreaName.DEBUG_TOGGLE,
            start: [0, 1],
            end: [2, 1],
          },
          {
            name: GridAreaName.RULE_ARRAY,
            start: [0, 2],
            end: [0, 2],
          },
          {
            name: GridAreaName.BOARD,
            start: [1, 2],
            end: [1, 2],
          },
          {
            name: GridAreaName.HISTORY,
            start: [2, 2],
            end: [2, 2],
          },
          {
            name: GridAreaName.FORM,
            start: [0, 3],
            end: [2, 3],
          },
        ]}
      >
        <Box gridArea={GridAreaName.HEADING} align="center">
          <Button
            label="Export Full History"
            onClick={() => {
              const blob = new Blob([JSON.stringify(history)], {
                type: 'text/plain;charset=utf-8',
              });
              saveAs(blob, `full-history-${Date.now()}.json`);
            }}
          />
          <Heading margin={{ bottom: 'none' }}>{gameName}</Heading>
          {numDisplaysLeft !== undefined && (
            <Heading margin={{ top: 'none' }} level="4">
              Displays Left: {numDisplaysLeft}
            </Heading>
          )}
        </Box>
        <Box gridArea={GridAreaName.DEBUG_TOGGLE} justify="center" direction="row">
          {DEBUG_ENABLED && (
            <CheckBox
              checked={debugModeEnabled}
              label="Debug Mode"
              onChange={(event) => {
                if (event.target.checked) {
                  dispatch(enableDebugMode());
                } else {
                  dispatch(disableDebugMode());
                }
              }}
            />
          )}
        </Box>
        {debugModeEnabled && rawAtoms && (
          <Box gridArea={GridAreaName.RULE_ARRAY}>
            {order && (
              <Box width="small" overflow="auto" margin={{ bottom: 'small' }}>
                <Text size="small">{JSON.stringify(order)}</Text>
              </Box>
            )}
            {rawAtoms.split('\n').map((rawAtom, i) => (
              <Box
                key={rawAtom}
                background={ruleRowIndex === i && !gameCompleted ? 'yellow' : 'none'}
              >
                <Text size="small">{rawAtom}</Text>
              </Box>
            ))}
            <Box background={gameCompleted ? 'yellow' : 'end'}>
              <Text size="small">loop/end</Text>
            </Box>
          </Box>
        )}
        <Box gridArea={GridAreaName.BOARD} align="center">
          <Board
            className={className}
            onBoardObjectClick={(boardObject) => dispatch(touch(boardObject.id))}
            boardObjects={boardObjects}
            boardObjectsToBuckets={boardObjectsToBuckets}
            boardObjectsToDebugInfo={boardObjectsToDebugInfo}
            paused={paused}
            droppedBucketShape={droppedBucketShape}
            onDrop={(bucket: BucketType) => (droppedItem: BoardObjectItem): void => {
              dispatch(move({ dragged: droppedItem.id, dropped: bucket.pos }));
            }}
          />
        </Box>
        {historyDebugInfo && (
          <Box gridArea={GridAreaName.HISTORY} overflow="auto">
            History Log:
            {historyDebugInfo.map((dropAttemptString) =>
              dropAttemptString.split('\n').map((item) => {
                return <div key={item}>{item}</div>;
              }),
            )}
          </Box>
        )}
        <Box gridArea={GridAreaName.FORM} align="center">
          {!gameCompleted && (
            <Box gap="small">
              <Button label="Give up" onClick={() => dispatch(goToPage('Entrance'))} />
            </Box>
          )}
          {gameCompleted && (
            <Box data-cy={CY_NO_MORE_MOVES}>
              {submittedGuess ? (
                <Box gap="medium">
                  <Text>
                    {allChecked
                      ? 'You’ve cleared all the shapes! Please guess the rule below”!'
                      : 'Error: Bad Rule Array (Board could not be cleared)'}
                  </Text>
                  <Button label="Finish" onClick={() => dispatch(goToPage('Entrance'))} />
                  <Button
                    label={`New Display${noMoreDisplays ? ' (No more displays)' : ''}`}
                    disabled={noMoreDisplays}
                    onClick={() => {
                      setSubmittedGuess(false);
                      dispatch(nextBoardObjectsArray());
                    }}
                  />

                  <Button label="Try a new rule" onClick={() => dispatch(goToPage('Entrance'))} />
                </Box>
              ) : (
                <GuessRuleForm gameId={gameId as string} onSubmit={() => setSubmittedGuess(true)} />
              )}
            </Box>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default Game;
