import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, Heading, Paragraph, Text } from 'grommet';
import { Dispatch } from 'redux';
import Board from './Board';
import { RootAction } from '../store/actions';
import GuessRuleForm from './GuessRuleForm';
import { CY_GAME, CY_NO_MORE_MOVES } from '../constants/data-cy';
import { giveUp } from '../store/actions/board';
import {
  historyInfoSelector,
  isGameCompletedSelector,
  pausedSelector,
  ruleLineNoSelector,
  ruleSrcSelector,
  seriesNoSelector,
} from '../store/selectors/board';
import { DEBUG_ENABLED } from '../constants/env';

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

  const paused = useSelector(pausedSelector);
  const isGameCompleted = useSelector(isGameCompletedSelector);
  const seriesNo = useSelector(seriesNoSelector);
  const ruleSrc = useSelector(ruleSrcSelector);
  const ruleLineNo = useSelector(ruleLineNoSelector);
  const historyInfo = useSelector(historyInfoSelector);

  return (
    <Box pad="small" data-cy={CY_GAME}>
      <Grid
        rows={['auto', 'min(60vh, 100vw)', 'auto']}
        columns={['auto', 'min(60vh, 100vw)', 'auto']}
        areas={[
          {
            name: GridAreaName.HEADING,
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
        <Box gridArea={GridAreaName.HEADING} align="center">
          <Heading margin={{ bottom: 'none' }}>{`Rule ${seriesNo + 1}`}</Heading>
        </Box>
        <Box gridArea={GridAreaName.BOARD} align="center">
          <Board className={className} paused={paused} />
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

        {DEBUG_ENABLED && (
          <>
            <Box gridArea={GridAreaName.RULE_ARRAY}>
              <Box width="small" overflow="auto" margin={{ bottom: 'small' }}>
                <Text size="small">{String(ruleSrc.orders)}</Text>
              </Box>
              {ruleSrc.rows.map((rawAtom, i) => (
                <Box
                  key={rawAtom}
                  background={ruleLineNo === i && !isGameCompleted ? 'yellow' : 'none'}
                >
                  <Text size="small">{rawAtom}</Text>
                </Box>
              ))}
              <Box background={isGameCompleted ? 'yellow' : 'end'}>
                <Text size="small">loop/end</Text>
              </Box>
            </Box>

            <Box gridArea={GridAreaName.HISTORY} overflow="auto">
              History Log:
              {/* eslint-disable react/no-array-index-key */}
              {historyInfo.map((moveInfo, i) => (
                <Box
                  key={i}
                  border={[
                    { side: 'top', style: 'dotted' },
                    { side: 'bottom', style: 'dotted' },
                  ]}
                  style={{ minHeight: 'unset' }}
                >
                  {/* eslint-enable react/no-array-index-key */}
                  {Object.entries(moveInfo).map(([key, value]) => (
                    <Box key={key} style={{ minHeight: 'unset' }}>
                      <Text size="small">
                        {key}: {value}
                      </Text>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Game;
