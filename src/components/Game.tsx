import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, Heading } from 'grommet';
import { Dispatch } from 'redux';
import Board from './Board';
import { RootAction } from '../store/actions';
import GuessRuleForm from './GuessRuleForm';
import { CY_GAME, CY_NO_MORE_MOVES } from '../constants/data-cy';
import { giveUp } from '../store/actions/board';
import {
  boardObjectsSelector,
  isGameCompletedSelector,
  pausedSelector,
  seriesNoSelector,
} from '../store/selectors/board';

enum GridAreaName {
  HEADING = 'HEADING',
  HISTORY = 'HISTORY',
  RULE_ARRAY = 'RULE_ARRAY',
  BOARD = 'BOARD',
  FORM = 'FORM',
}

const Game: React.FunctionComponent<{
  className?: string;
}> = ({ className }) => {
  const dispatch: Dispatch<RootAction> = useDispatch();

  const boardObjects = useSelector(boardObjectsSelector);
  const paused = useSelector(pausedSelector);
  const isGameCompleted = useSelector(isGameCompletedSelector);
  const seriesNo = useSelector(seriesNoSelector);

  return (
    <Box pad="small" data-cy={CY_GAME}>
      <Grid
        rows={['auto', 'min(70vh, 100vw)', 'auto']}
        columns={['auto', 'min(70vh, 100vw)', 'auto']}
        areas={[
          {
            name: GridAreaName.HEADING,
            start: [0, 0],
            end: [2, 0],
          },
          // TODO: Need server to expose rule array and current rule array row
          // {
          //   name: GridAreaName.RULE_ARRAY,
          //   start: [0, 1],
          //   end: [0, 1],
          // },
          {
            name: GridAreaName.BOARD,
            start: [1, 1],
            end: [1, 1],
          },
          // TODO: Need server to expose full history
          // {
          //   name: GridAreaName.HISTORY,
          //   start: [2, 1],
          //   end: [2, 1],
          // },
          {
            name: GridAreaName.FORM,
            start: [0, 2],
            end: [2, 2],
          },
        ]}
      >
        <Box gridArea={GridAreaName.HEADING} align="center">
          <Heading margin={{ bottom: 'none' }}>{`Rule ${seriesNo + 1}`}</Heading>
        </Box>
        <Box gridArea={GridAreaName.BOARD} align="center">
          <Board className={className} boardObjects={boardObjects} paused={paused} />
        </Box>
        <Box gridArea={GridAreaName.FORM} align="center">
          {!isGameCompleted && (
            <Box gap="small">
              <Button label="Give up" onClick={() => dispatch(giveUp())} />
            </Box>
          )}
          {isGameCompleted && (
            <Box data-cy={CY_NO_MORE_MOVES}>
              <GuessRuleForm />
            </Box>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default Game;
