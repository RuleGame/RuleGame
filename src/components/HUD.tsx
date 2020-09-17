import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Text } from 'grommet';
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
        <Text>
          <Text size="xxlarge" weight="bold">
            Number of moves made:&nbsp;
          </Text>
          <Text size="2em" weight="bold" color="light-blue">
            {numMovesMade}
          </Text>
        </Text>
      </Box>
      {numMovesLeft !== undefined && (
        <Box gridArea={GridArea.NUM_MOVES_LEFT} direction="row" align="start" justify="end">
          <Text>
            <Text size="xxlarge" weight="bold">
              Number of moves left:&nbsp;
            </Text>
            <Text size="2em" weight="bold" color="red">
              {numMovesLeft}
            </Text>
          </Text>
        </Box>
      )}
      <Box gridArea={GridArea.GAME}>{children}</Box>
      <Box gridArea={GridArea.BOARD_COUNT} direction="row" align="end">
        <Text>
          <Text size="xxlarge" weight="bold">
            Board&nbsp;
          </Text>
          <Text size="2em" weight="bold">
            {boardNum} of {numBoardsLeft}
          </Text>
        </Text>
      </Box>
      <Box gridArea={GridArea.POINTS} direction="row" align="end" justify="end">
        <Text>
          <Text size="xxlarge" weight="bold">
            Points:&nbsp;
          </Text>
          <Text size="2em" color="green" weight="bold">
            {points}
          </Text>
        </Text>
      </Box>
    </Grid>
  );
};

export default HUD;
