import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, CheckBox, Grid, Text } from 'grommet';
import { Dispatch } from 'redux';
import { BoardObjectItem, BucketType } from '../@types';
import { disableDebugMode, enableDebugMode, move, touch } from '../store/actions/rule-row';
import Board from './Board';
import {
  allChecksSelector,
  boardObjectsSelector,
  boardObjectsToDebugInfoSelector,
  boardObjectToBucketsSelector,
  debugModeSelector,
  disabledBucketSelector,
  gameCompletedSelector,
  historyDebugInfoSelector,
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
import { currGameIdSelector } from '../store/selectors/rule-row';

enum GridAreaName {
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

  const disabledBucket = useSelector(disabledBucketSelector);
  const boardObjects = useSelector(boardObjectsSelector);
  const boardObjectsToBuckets = useSelector(boardObjectToBucketsSelector);
  const paused = useSelector(pausedSelector);
  const boardObjectsToDebugInfo = useSelector(boardObjectsToDebugInfoSelector);
  const debugModeEnabled = useSelector(debugModeSelector);
  const historyDebugInfo = useSelector(historyDebugInfoSelector);
  const ruleRowIndex = useSelector(ruleRowIndexSelector);
  const rawAtoms = useSelector(rawAtomsSelector);
  const gameCompleted = useSelector(gameCompletedSelector);
  const order = useSelector(orderSelector);
  const gameId = useSelector(currGameIdSelector);
  const allChecked = useSelector(allChecksSelector);

  return (
    <Box pad="small" data-cy={CY_GAME}>
      <Grid
        rows={['auto', 'min(70vh, 100vw)', 'auto']}
        columns={['auto', 'min(70vh, 100vw)', 'auto']}
        areas={[
          {
            name: GridAreaName.DEBUG_TOGGLE,
            start: [0, 0],
            end: [2, 0],
          },
          {
            name: GridAreaName.RULE_ARRAY,
            start: [0, 1],
            end: [0, 1],
          },
          {
            name: GridAreaName.BOARD,
            start: [1, 1],
            end: [1, 1],
          },
          {
            name: GridAreaName.HISTORY,
            start: [2, 1],
            end: [2, 1],
          },
          {
            name: GridAreaName.FORM,
            start: [0, 2],
            end: [2, 2],
          },
        ]}
      >
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
              <Box key={rawAtom} background={ruleRowIndex === i ? 'yellow' : 'none'}>
                <Text size="small">{rawAtom}</Text>
              </Box>
            ))}
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
            disabledBucket={disabledBucket}
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
              <Button label="New Display" onClick={() => dispatch(nextBoardObjectsArray())} />
            </Box>
          )}
          {gameCompleted && (
            <Box gap="medium">
              <Text data-cy={CY_NO_MORE_MOVES}>
                {allChecked
                  ? 'You’ve cleared all the shapes! Please guess the rule below”!'
                  : 'Error: Bad Rule Array (Board could not be cleared)'}
              </Text>
              <Button label="Finish" onClick={() => dispatch(goToPage('Entrance'))} />
              <Button label="New Display" onClick={() => dispatch(nextBoardObjectsArray())} />
              <Button label="Try a new rule" onClick={() => dispatch(goToPage('Entrance'))} />
              <GuessRuleForm gameId={gameId as string} />
            </Box>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default Game;
