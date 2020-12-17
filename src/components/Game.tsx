import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, CheckBox, Drop, Grid, Heading, Text } from 'grommet';
import { Dispatch } from 'redux';
import { Help, Next } from 'grommet-icons';
import Board from './Board';
import { RootAction } from '../store/actions';
import GuessRuleForm from './GuessRuleForm';
import { CY_GAME, CY_NO_MORE_MOVES } from '../constants/data-cy';
import { activateBonus, giveUp, loadNextBonus } from '../store/actions/board';
import {
  allowGiveUpOptionSelector,
  canActivateBonusSelector,
  episodeNoSelector,
  finishCodeSelector,
  hasMoreBonusRoundsSelector,
  historyInfoSelector,
  isGameCompletedSelector,
  isInBonusSelector,
  pausedSelector,
  ruleLineNoSelector,
  ruleSrcSelector,
  seriesNoSelector,
} from '../store/selectors/board';
import { addLayer, removeLayer } from '../store/actions/layers';
import { FinishCode } from '../utils/api';
import { debugModeSelector } from '../store/selectors/debug-mode';
import { setDebugMode } from '../store/actions/debug-mode';
import { DEBUG_ENABLED } from '../constants/env';
import texts from '../constants/texts';
import { Page } from '../constants/Page';

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
  const instructionsButtonRef = useRef<HTMLButtonElement | null>(null);

  const paused = useSelector(pausedSelector);
  const isGameCompleted = useSelector(isGameCompletedSelector);
  const seriesNo = useSelector(seriesNoSelector);
  const ruleSrc = useSelector(ruleSrcSelector);
  const ruleLineNo = useSelector(ruleLineNoSelector);
  const historyInfo = useSelector(historyInfoSelector);
  const isInBonus = useSelector(isInBonusSelector);
  const canActivateBonus = useSelector(canActivateBonusSelector);
  const episodeNo = useSelector(episodeNoSelector);
  const hasMoreBonusRounds = useSelector(hasMoreBonusRoundsSelector);
  const [bonusActivated, setBonusActivated] = useState(false);
  const finishCode = useSelector(finishCodeSelector);
  const debugMode = useSelector(debugModeSelector);
  const allowGiveUpOption = useSelector(allowGiveUpOptionSelector);
  const [instructionsButtonOver, setInstructionsButtonOver] = useState(false);

  useEffect(() => {
    setBonusActivated(false);
  }, [episodeNo]);

  const ruleNum = seriesNo + 1;
  const ruleName = isInBonus
    ? texts[Page.TRIALS].bonusTitle(ruleNum)
    : texts[Page.TRIALS].ruleTitle(ruleNum);

  return (
    <Grid
      fill="vertical"
      pad="small"
      data-cy={CY_GAME}
      rows={['auto', 'auto', 'auto']}
      columns={['1fr', 'auto', '1fr']}
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
          start: [0, 2],
          end: [2, 2],
        },
      ]}
    >
      <Box gridArea={GridAreaName.HEADING}>
        <Box style={{ position: 'relative', display: 'block' }}>
          <Box align="center" gap="small">
            <Heading margin="none">{ruleName}</Heading>
            {DEBUG_ENABLED && (
              <CheckBox
                checked={debugMode}
                label="Debug Mode"
                onChange={({ target: { checked } }) => dispatch(setDebugMode(checked))}
              />
            )}
          </Box>
          {instructionsButtonOver && instructionsButtonRef.current !== null && (
            <Drop
              align={{ bottom: 'top' }}
              target={instructionsButtonRef.current}
              plain
              // trapFocus set to false allows tabbing through
              trapFocus={false}
            >
              <Box pad="small" background="gray">
                <Text color="white">{texts[Page.TRIALS].instructionsButtonLabel}</Text>
              </Box>
            </Drop>
          )}
          <Button
            style={{ position: 'absolute', right: 0, top: 0 }}
            primary
            size="small"
            icon={<Help size="small" />}
            onMouseOver={() => setInstructionsButtonOver(true)}
            onMouseLeave={() => setInstructionsButtonOver(false)}
            onFocus={() => setInstructionsButtonOver(true)}
            onBlur={() => setInstructionsButtonOver(false)}
            ref={instructionsButtonRef}
            onClick={() =>
              window.open(`${window.location.origin}${window.location.pathname}/?help=true`)
            }
          />
        </Box>
      </Box>
      <Box
        gridArea={GridAreaName.BOARD}
        align="center"
        pad="medium"
        alignSelf="center"
        justify="center"
        fill
      >
        <Board className={className} paused={paused} />
      </Box>
      <Box gridArea={GridAreaName.FORM} align="center">
        {!isGameCompleted && allowGiveUpOption && (
          <Box gap="small">
            <Button
              label={texts[Page.TRIALS].giveUpButtonLabel}
              onClick={() =>
                dispatch(
                  addLayer(
                    texts[Page.TRIALS].giveUpButtonLabel,
                    texts[Page.TRIALS].giveUpConfirmationWarning(ruleNum),
                    [
                      {
                        label: texts[Page.TRIALS].giveUpYesConfirmationLabel,
                        action: [giveUp(), (id) => removeLayer(id)],
                      },
                      {
                        label: texts[Page.TRIALS].giveUpNoConfirmationLabel,
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
          // FireFox needs height={{ min: 'unset' }} inside a grid
          <Box
            data-cy={CY_NO_MORE_MOVES}
            height={{ min: 'unset' }}
            gap="large"
            pad={{ left: 'xlarge', right: 'xlarge' }}
            fill
          >
            <GuessRuleForm />
          </Box>
        )}
        {isGameCompleted && isInBonus && (
          <Box align="center">
            <Heading>
              {finishCode === FinishCode.FINISH ? (
                <Text size="inherit" color="blue">
                  {texts[Page.TRIALS].bonusSuccessMessage}
                </Text>
              ) : finishCode === FinishCode.STALEMATE || finishCode === FinishCode.LOST ? (
                <Text size="inherit" color="red">
                  {texts[Page.TRIALS].bonusFailureMessage}
                </Text>
              ) : (
                ''
              )}
            </Heading>
            <Button
              label={
                hasMoreBonusRounds
                  ? texts[Page.TRIALS].nextBonusRoundButtonLabel
                  : finishCode === FinishCode.LOST
                  ? texts[Page.TRIALS].lastBonusRoundButtonLostLabel
                  : texts[Page.TRIALS].lastBonusRoundButtonWonLabel
              }
              icon={<Next />}
              onClick={() => dispatch(loadNextBonus())}
            />
          </Box>
        )}
      </Box>

      {(debugMode || canActivateBonus) && (
        <Box gridArea={GridAreaName.LEFT_OF_BOARD} align="end">
          {debugMode && (
            <Box fill="vertical">
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
          {canActivateBonus && isGameCompleted && !isInBonus && (
            <Box fill="vertical" justify="center">
              <Box>
                {bonusActivated ? (
                  <Box border={{ side: 'all', style: 'dashed', size: 'medium' }} round pad="medium">
                    <Text size="large" textAlign="center">
                      {texts[Page.TRIALS].bonusRoundsActivatedMessage}
                    </Text>
                  </Box>
                ) : (
                  <Button
                    primary
                    color="darkorange"
                    label={texts[Page.TRIALS].activateBonusRoundsButtonLabel}
                    onClick={() => {
                      setBonusActivated(true);
                      dispatch(activateBonus());
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {debugMode && (
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
  );
};

export default Game;
