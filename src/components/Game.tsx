import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, Heading, Text } from 'grommet';
import { Dispatch } from 'redux';
import { Next } from 'grommet-icons';
import Board from './Board';
import { RootAction } from '../store/actions';
import GuessRuleForm from './GuessRuleForm';
import { CY_GAME, CY_NO_MORE_MOVES } from '../constants/data-cy';
import { activateBonus, giveUp, loadNextBonus, skipGuess } from '../store/actions/board';
import {
  canActivateBonusSelector,
  historyInfoSelector,
  isGameCompletedSelector,
  isInBonusSelector,
  pausedSelector,
  ruleLineNoSelector,
  ruleSrcSelector,
  seriesNoSelector,
} from '../store/selectors/board';
import { DEBUG_ENABLED } from '../constants/env';
import { addLayer, removeLayer } from '../store/actions/layers';

enum GridAreaName {
  HEADING = 'HEADING',
  HISTORY = 'HISTORY',
  LEFT_OF_BOARD = 'LEFT_OF_BOARD',
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
  const isInBonus = useSelector(isInBonusSelector);
  const canActivateBonus = useSelector(canActivateBonusSelector);

  const ruleName = `Rule ${seriesNo + 1}`;

  return (
    <Box pad="small" data-cy={CY_GAME}>
      <Grid
        rows={['auto', 'min(50vh, 100vw)', 'auto']}
        columns={['1fr', 'min(50vh, 100vw)', '1fr']}
        areas={[
          {
            name: GridAreaName.HEADING,
            start: [1, 0],
            end: [1, 0],
          },
          {
            name: GridAreaName.LEFT_OF_BOARD,
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
            start: [1, 2],
            end: [1, 2],
          },
        ]}
      >
        <Box gridArea={GridAreaName.HEADING} align="center">
          <Heading margin="none">{ruleName}</Heading>
        </Box>
        <Box gridArea={GridAreaName.BOARD} align="center" pad="medium">
          <Board className={className} paused={paused} />
        </Box>
        <Box gridArea={GridAreaName.FORM} align="center">
          {!isGameCompleted && (
            <Box gap="small">
              <Button
                label="Give up rule"
                onClick={() =>
                  dispatch(
                    addLayer(
                      'Give up rule',
                      `Are you sure you want to give up ${ruleName} and advance to the next rule if any?`,
                      [
                        {
                          label: 'Yes',
                          action: [giveUp(), (id) => removeLayer(id)],
                        },
                        {
                          label: 'No',
                          action: (id) => removeLayer(id),
                        },
                      ],
                    ),
                  )
                }
              />
            </Box>
          )}
          {isGameCompleted && !isInBonus && (
            <Box gap="large">
              <Box fill>
                <GuessRuleForm />
              </Box>
              <Box data-cy={CY_NO_MORE_MOVES} fill>
                <Button
                  label="Skip guess"
                  icon={<Next />}
                  onClick={() =>
                    dispatch(
                      addLayer('Skip guess', 'Do you want to proceed without making a guess?', [
                        {
                          label: 'Yes',
                          action: [skipGuess(), (id) => removeLayer(id)],
                        },
                        {
                          label: 'No',
                          action: (id) => removeLayer(id),
                        },
                      ]),
                    )
                  }
                />
              </Box>
            </Box>
          )}
          {isGameCompleted && isInBonus && (
            <Box>
              <Button label="Next" icon={<Next />} onClick={() => dispatch(loadNextBonus())} />
            </Box>
          )}
        </Box>

        {(DEBUG_ENABLED || canActivateBonus) && (
          <Box gridArea={GridAreaName.LEFT_OF_BOARD} align="end">
            {DEBUG_ENABLED && (
              <Box>
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
            )}
            {canActivateBonus && (
              <Box fill="vertical" justify="center">
                <Box>
                  <Button
                    primary
                    color="darkorange"
                    label={
                      <Text color="white" size="large" weight="bold">
                        <Box>Think you got it?</Box>
                        <Box>Activate bonus rounds!</Box>
                      </Text>
                    }
                    onClick={() => dispatch(activateBonus())}
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}

        {DEBUG_ENABLED && (
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
        )}
      </Grid>
    </Box>
  );
};

export default Game;
