import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Heading, Stack, Text } from 'grommet';
import range from 'lodash/range';
import {
  episodeIdSelector,
  episodeNoSelector,
  maxPointsSelector,
  movesLeftToStayInBonusSelector,
  numMovesMadeSelector,
  totalBoardsPredictedSelector,
  totalRewardEarnedSelector,
} from '../store/selectors/board';
import { debugModeSelector } from '../store/selectors/debug-mode';
import texts from '../constants/texts';
import { Page } from '../constants/Page';

enum GridArea {
  NUM_MOVES_MADE = 'NUM_MOVES_MADE',
  NUM_MOVES_LEFT = 'NUM_MOVES_LEFT',
  GAME = 'GAME',
  BOARD_COUNT = 'BOARD_COUNT',
  POINTS = 'POINTS',
}

const NUM_TICKS = 7;

const HUD: React.FunctionComponent = ({ children }) => {
  const numMovesMade = useSelector(numMovesMadeSelector);
  const boardNum = useSelector(episodeNoSelector) + 1;
  const points = useSelector(totalRewardEarnedSelector);
  const numMovesLeft = useSelector(movesLeftToStayInBonusSelector);
  const numBoardsLeft = useSelector(totalBoardsPredictedSelector);
  const episodeId = useSelector(episodeIdSelector);
  const maxPoints = useSelector(maxPointsSelector);
  const debugMode = useSelector(debugModeSelector);

  return (
    <Grid
      fill
      pad="small"
      rows={['min-content', 'auto', 'min-content']}
      columns={['1fr', '1fr']}
      areas={[
        {
          name: GridArea.NUM_MOVES_MADE,
          start: [0, 0],
          end: [0, 0],
        },
        {
          name: GridArea.NUM_MOVES_LEFT,
          start: [1, 0],
          end: [1, 0],
        },
        {
          name: GridArea.GAME,
          start: [0, 1],
          end: [1, 1],
        },
        {
          name: GridArea.BOARD_COUNT,
          start: [0, 2],
          end: [0, 2],
        },
        {
          name: GridArea.POINTS,
          start: [1, 2],
          end: [1, 2],
        },
      ]}
    >
      <Box gridArea={GridArea.NUM_MOVES_MADE} direction="row" align="start">
        <Heading level="2" margin="none">
          <Box direction="row" align="baseline">
            <Text size="inherit" weight="bold">
              {texts[Page.TRIALS].numMovesMadePreText}&nbsp;
            </Text>
            <Text size="2em" weight="bold" color="light-blue">
              {numMovesMade}
            </Text>
          </Box>
        </Heading>
      </Box>
      {numMovesLeft !== undefined && (
        <Box gridArea={GridArea.NUM_MOVES_LEFT} direction="row" align="start" justify="end">
          <Heading level="2" margin="none">
            <Box direction="row" align="baseline">
              <Text size="inherit" weight="bold">
                {texts[Page.TRIALS].numMovesLeftPreText}&nbsp;
              </Text>
              <Text size="2em" weight="bold" color="red">
                {numMovesLeft}
              </Text>
            </Box>
          </Heading>
        </Box>
      )}
      <Box gridArea={GridArea.GAME} justify="center" align="center">
        <Box
          width="max-content"
          border={{ size: 'medium', style: 'dashed' }}
          justify="center"
          align="center"
          overflow="auto"
          fill="vertical"
          margin="small"
        >
          {children}
        </Box>
      </Box>
      <Box gridArea={GridArea.BOARD_COUNT} justify="end">
        {debugMode && (
          <>
            <Heading level="3" margin="none">
              Episode: {episodeId}
            </Heading>
            <Heading level="4" margin="none">
              (for debugging)
            </Heading>
          </>
        )}
        <Heading level="2" margin="none">
          <Box direction="row" align="baseline">
            {texts[Page.TRIALS].boardNumText(boardNum, numBoardsLeft)}
          </Box>
        </Heading>
      </Box>
      <Box gridArea={GridArea.POINTS} direction="row" align="end" justify="end">
        <Box align="end" direction="row" gap="small">
          <Heading level="2" margin="none">
            <Box direction="row" align="baseline">
              <Text weight="bold" size="inherit">
                {texts[Page.TRIALS].pointsPreText}&nbsp;
              </Text>
              <Text color="green" weight="bold" size="2em">
                {points}
              </Text>
            </Box>
          </Heading>
          <Box
            border="all"
            justify="end"
            direction="column"
            width="2em"
            height="5em"
            round="xsmall"
            overflow="hidden"
          >
            <Stack fill>
              <Box justify="end" fill>
                <Box
                  fill="horizontal"
                  height={`${Math.min(1, points / maxPoints) * 100}%`}
                  background="green"
                />
              </Box>
              <Box justify="end" fill>
                {range(NUM_TICKS).map((i) => (
                  <Box
                    key={i}
                    width="50%"
                    height={`${(1 / NUM_TICKS) * 100}%`}
                    border={{ side: 'top', size: 'small' }}
                  />
                ))}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default HUD;
