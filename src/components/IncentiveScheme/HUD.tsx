import {
  Box,
  Grid,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from 'grommet';
import React from 'react';
import { useSelector } from 'react-redux';
import { useMeasure } from 'react-use';
import { Page } from '../../constants/Page';
import texts from '../../constants/texts';
import {
  episodeIdSelector,
  episodeNoSelector,
  movesLeftToStayInBonusSelector,
  numMovesMadeSelector,
  rewardsAndFactorsPerSeriesSelector,
  ruleSetNameSelector,
  totalBoardsPredictedSelector,
  totalRewardsAndFactorsPerSeriesSelector,
  trialListIdSelector,
} from '../../store/selectors/board';
import { debugModeSelector } from '../../store/selectors/debug-mode';
import InformationArea from '../InformationArea';

enum GridArea {
  NUM_MOVES = 'NUM_MOVES',
  GAME = 'GAME',
  BOARD_COUNT = 'BOARD_COUNT',
  POINTS = 'POINTS',
  INFORMATION_AREA = 'INFORMATION_AREA',
}

const NUM_FONT_SIZE = '1.25em;';

const HUD: React.FunctionComponent = ({ children }) => {
  const numMovesMade = useSelector(numMovesMadeSelector);
  const boardNum = useSelector(episodeNoSelector) + 1;
  const numMovesLeft = useSelector(movesLeftToStayInBonusSelector);
  const numBoardsLeft = useSelector(totalBoardsPredictedSelector);
  const episodeId = useSelector(episodeIdSelector);
  const debugMode = useSelector(debugModeSelector);
  const ruleSetName = useSelector(ruleSetNameSelector);
  const trialListId = useSelector(trialListIdSelector);
  const rewardsAndFactorsPerSeries = useSelector(rewardsAndFactorsPerSeriesSelector);
  const totalReward = useSelector(totalRewardsAndFactorsPerSeriesSelector);
  const [ref, { height, width }] = useMeasure();

  return (
    <Box fill direction="row">
      <Box width="50em">
        <Grid
          fill
          pad="small"
          rows={['auto', 'min-content', 'min-content']}
          columns={['1fr', '1fr']}
          areas={[
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
            {
              name: GridArea.INFORMATION_AREA,
              start: [0, 0],
              end: [1, 0],
            },
            {
              name: GridArea.NUM_MOVES,
              start: [0, 1],
              end: [1, 1],
            },
          ]}
        >
          <Box gridArea={GridArea.NUM_MOVES} align="start" justify="end">
            {debugMode && (
              <Text>
                <Heading level="4" margin="none">
                  Episode: {episodeId} <br /> Trial List Id: {trialListId} <br /> Rule Set Name:{' '}
                  {ruleSetName}
                </Heading>
              </Text>
            )}
            {numMovesLeft !== undefined && (
              <Heading level="3" margin="none">
                <Box direction="row" align="baseline">
                  <Text size="inherit" weight="bold">
                    {texts[Page.TRIALS].numMovesLeftPreText}&nbsp;
                    {numMovesLeft}
                  </Text>
                </Box>
              </Heading>
            )}
            <Heading level="3" margin="none">
              <Box direction="row" align="end">
                <Text size="inherit" weight="bold">
                  {texts[Page.TRIALS].numMovesMadePreText}&nbsp;
                  {numMovesMade}
                </Text>
              </Box>
            </Heading>
          </Box>
          <Box gridArea={GridArea.BOARD_COUNT} justify="end">
            <Heading level="3" margin="none">
              <Box direction="row" align="baseline">
                {texts[Page.TRIALS].boardNumText(boardNum, numBoardsLeft)}
              </Box>
            </Heading>
          </Box>
          <Box gridArea={GridArea.POINTS} align="end" justify="end">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell scope="col" border="bottom" verticalAlign="bottom">
                    Rule
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    Reward <br />
                    (Points x Factor)
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardsAndFactorsPerSeries.map(([reward, incentiveFactor], index) => (
                  <TableRow>
                    <TableCell scope="row">
                      <strong>{index + 1}</strong>
                    </TableCell>
                    <TableCell>
                      {reward} x {incentiveFactor} = {reward * incentiveFactor}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box align="end" direction="row" gap="small">
              <Heading level="3" margin="none">
                <Box direction="row" align="baseline">
                  <Text weight="bold" size="inherit">
                    Total Reward:&nbsp;
                  </Text>
                  <Text color="green" weight="bold" size={NUM_FONT_SIZE}>
                    {totalReward}
                  </Text>
                </Box>
              </Heading>
            </Box>
          </Box>
          <Box gridArea={GridArea.INFORMATION_AREA} justify="center" height="max-content" fill>
            <InformationArea />
          </Box>
        </Grid>
      </Box>
      <Box justify="center" align="center" ref={ref} fill>
        {/* <Box justify="center" align="center" ref={ref} fill="vertical"> */}
        <Box
          width="max-content"
          border={{ size: 'medium', style: 'dashed' }}
          justify="center"
          align="center"
          overflow="auto"
          fill="vertical"
          // fill
          margin="small"
          // style={{ flex: 1 }}
          style={{ width: `${Math.min(width, height)}px`, height: `${Math.min(width, height)}px` }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default HUD;
