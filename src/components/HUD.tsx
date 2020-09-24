import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Heading, Text } from 'grommet';
import {
  episodeIdSelector,
  episodeNoSelector,
  movesLeftToStayInBonusSelector,
  numMovesMadeSelector,
  totalBoardsPredictedSelector,
  totalRewardEarnedSelector,
} from '../store/selectors/board';
import { DEBUG_ENABLED } from '../constants/env';

enum GridArea {
  NUM_MOVES_MADE = 'NUM_MOVES_MADE',
  NUM_MOVES_LEFT = 'NUM_MOVES_LEFT',
  GAME = 'GAME',
  BOARD_COUNT = 'BOARD_COUNT',
  POINTS = 'POINTS',
}

const HUD: React.FunctionComponent = ({ children }) => {
  const numMovesMade = useSelector(numMovesMadeSelector);
  const boardNum = useSelector(episodeNoSelector) + 1;
  const points = useSelector(totalRewardEarnedSelector);
  const numMovesLeft = useSelector(movesLeftToStayInBonusSelector);
  const numBoardsLeft = useSelector(totalBoardsPredictedSelector);
  const episodeId = useSelector(episodeIdSelector);

  return (
    <Grid
      fill
      pad="small"
      rows={['auto', 'auto', 'auto']}
      columns={['auto', 'auto']}
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
              Number of moves made:&nbsp;
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
                Number of moves left:&nbsp;
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
          border={{ size: 'large', style: 'dashed' }}
          justify="center"
          align="center"
          overflow="auto"
          fill="vertical"
        >
          {children}
        </Box>
      </Box>
      <Box gridArea={GridArea.BOARD_COUNT} justify="end">
        {DEBUG_ENABLED && (
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
            <Text size="inherit" weight="bold">
              Board&nbsp;
            </Text>
            <Text size="2em" weight="bold">
              {boardNum} of {numBoardsLeft}
            </Text>
          </Box>
        </Heading>
      </Box>
      <Box gridArea={GridArea.POINTS} direction="row" align="end" justify="end">
        <Heading level="2" margin="none">
          <Box direction="row" align="baseline">
            <Text weight="bold" size="inherit">
              Points:&nbsp;
            </Text>
            <Text color="green" weight="bold" size="2em">
              {points}
            </Text>
          </Box>
        </Heading>
      </Box>
    </Grid>
  );
};

export default HUD;
