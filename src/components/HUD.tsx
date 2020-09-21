import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Heading, Text } from 'grommet';
import {
  episodeNoSelector,
  movesLeftToStayInBonusSelector,
  numMovesMadeSelector,
  totalBoardsPredictedSelector,
  totalRewardEarnedSelector,
} from '../store/selectors/board';

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
          <Text size="inherit" weight="bold">
            Number of moves made:&nbsp;
          </Text>
          <Text size="inherit" weight="bold" color="light-blue">
            {numMovesMade}
          </Text>
        </Heading>
      </Box>
      {numMovesLeft !== undefined && (
        <Box gridArea={GridArea.NUM_MOVES_LEFT} direction="row" align="start" justify="end">
          <Heading level="2" margin="none">
            <Text size="inherit" weight="bold">
              Number of moves left:&nbsp;
            </Text>
            <Text size="inherit" weight="bold" color="red">
              {numMovesLeft}
            </Text>
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
        >
          {children}
        </Box>
      </Box>
      <Box gridArea={GridArea.BOARD_COUNT} direction="row" align="end">
        <Heading level="2" margin="none">
          <Text size="inherit" weight="bold">
            Board&nbsp;
          </Text>
          <Text size="inherit" weight="bold">
            {boardNum} of {numBoardsLeft}
          </Text>
        </Heading>
      </Box>
      <Box gridArea={GridArea.POINTS} direction="row" align="end" justify="end">
        <Heading level="2" margin="none">
          <Text weight="bold" size="inherit">
            Points:&nbsp;
          </Text>
          <Text color="green" weight="bold" size="inherit">
            {points}
          </Text>
        </Heading>
      </Box>
    </Grid>
  );
};

export default HUD;
