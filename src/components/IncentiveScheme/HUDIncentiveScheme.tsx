import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Heading, Stack, Text } from 'grommet';
import range from 'lodash/range';
import { useMeasure } from 'react-use';
import {
  episodeIdSelector,
  episodeNoSelector,
  maxPointsSelector,
  movesLeftToStayInBonusSelector,
  numMovesMadeSelector,
  ruleSetNameSelector,
  totalBoardsPredictedSelector,
  totalRewardEarnedSelector,
  trialListIdSelector,
} from '../../store/selectors/board';
import { debugModeSelector } from '../../store/selectors/debug-mode';
import texts from '../../constants/texts';
import { Page } from '../../constants/Page';
import InformationArea from '../InformationArea';

enum GridArea {
  NUM_MOVES = 'NUM_MOVES',
  GAME = 'GAME',
  BOARD_COUNT = 'BOARD_COUNT',
  POINTS = 'POINTS',
  INFORMATION_AREA = 'INFORMATION_AREA',
}

const NUM_TICKS = 7;
const NUM_FONT_SIZE = '1.25em;';

const HUD: React.FunctionComponent = ({ children }) => {
  const numMovesMade = useSelector(numMovesMadeSelector);
  const boardNum = useSelector(episodeNoSelector) + 1;
  const points = useSelector(totalRewardEarnedSelector);
  const numMovesLeft = useSelector(movesLeftToStayInBonusSelector);
  const numBoardsLeft = useSelector(totalBoardsPredictedSelector);
  const episodeId = useSelector(episodeIdSelector);
  const maxPoints = useSelector(maxPointsSelector);
  const debugMode = useSelector(debugModeSelector);
  const ruleSetName = useSelector(ruleSetNameSelector);
  const trialListId = useSelector(trialListIdSelector);
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
            <Box align="end" direction="row" gap="small">
              <Heading level="3" margin="none">
                <Box direction="row" align="baseline">
                  <Text weight="bold" size="inherit">
                    {texts[Page.TRIALS].pointsPreText}&nbsp;
                  </Text>
                  <Text color="green" weight="bold" size={NUM_FONT_SIZE}>
                    {points}
                  </Text>
                </Box>
              </Heading>
              <Box
                border="all"
                justify="end"
                direction="column"
                width={NUM_FONT_SIZE}
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
