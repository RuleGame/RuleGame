import React from 'react';
import { combineEpics } from 'redux-observable';
import { delay, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { Box, Heading, Image } from 'grommet';
import {
  completeGame,
  endRuleArray,
  endRuleRow,
  loadRuleArray,
  move,
  removeBoardObject,
  resumeGame,
  setRuleRowIndex,
} from '../actions/rule-row';
import {
  currGameNumConsecutiveSuccessfulMovesBeforePromptGuessSelector,
  noMoreMovesSelector,
  ruleRowIndexSelector,
} from '../selectors';
import { RootEpic } from '../../@types/epic';
import { goToPage } from '../actions/page';
import {
  currGameIdSelector,
  hasRestartedSelector,
  numConsecutiveSuccessfulMovesSelector,
  numRuleRowsSelector,
  restartIfNotClearedSelector,
} from '../selectors/rule-row';
import { addLayer, removeLayer } from '../actions/layers';
import HappyFace from '../../assets/smiley-face.png';
import { RootAction } from '../actions';
import { CyLayer } from '../../constants/data-cy';
import { FEEDBACK_DURATION } from '../../constants';
import GuessRuleForm from '../../components/GuessRuleForm';

const moveEpic: RootEpic = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(move)),
    filter(() => state$.value.ruleRow.lastMoveSuccessful),
    delay(FEEDBACK_DURATION),
    switchMap(() => {
      const currGameNumConsecutiveSuccessfulMovesBeforePromptGuessSelector1 = currGameNumConsecutiveSuccessfulMovesBeforePromptGuessSelector(
        state$.value,
      );

      const actions: RootAction[] = [
        removeBoardObject(
          state$.value.ruleRow.totalMoveHistory[state$.value.ruleRow.totalMoveHistory.length - 1]
            .dragged,
        ),
        resumeGame(),
      ];

      if (
        currGameNumConsecutiveSuccessfulMovesBeforePromptGuessSelector1 !== undefined &&
        currGameNumConsecutiveSuccessfulMovesBeforePromptGuessSelector1 > 0 &&
        numConsecutiveSuccessfulMovesSelector(state$.value) >=
          currGameNumConsecutiveSuccessfulMovesBeforePromptGuessSelector1
      ) {
        actions.push(
          addLayer(
            <Box height="25vh">
              <Image src={HappyFace} alt="happy-face" fit="contain" />
            </Box>,
            <Box align="center">
              <Heading>Would you like to guess the rule?</Heading>
              <Box width="50%">
                <GuessRuleForm gameId={currGameIdSelector(state$.value) as string} />
              </Box>
            </Box>,
            [
              {
                action: (layerId) => removeLayer(layerId),
                label: 'Continue Playing',
              },
            ],
            undefined,
            undefined,
            undefined,
            CyLayer.GUESS_PROMPT,
          ),
        );
      }

      return actions;
    }),
  );
};

const noMoreMovesEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([setRuleRowIndex, removeBoardObject])),
    filter(() => noMoreMovesSelector(state$.value)),
    map(() => endRuleRow()),
  );

const setRuleArrayEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(loadRuleArray)),
    map(() => goToPage('RuleGame')),
  );

const endRuleArrayEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(endRuleArray)),
    map(() => completeGame()),
  );

const endRuleRowEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(endRuleRow)),
    map(() => {
      const restartIfNotCleared = restartIfNotClearedSelector(state$.value);
      const ruleRowIndex = ruleRowIndexSelector(state$.value);
      const numRuleRows = numRuleRowsSelector(state$.value);
      const hasRestarted = hasRestartedSelector(state$.value);

      if (
        (!restartIfNotCleared || (restartIfNotCleared && hasRestarted)) &&
        ruleRowIndex === numRuleRows - 1
      ) {
        return endRuleArray();
      }
      return setRuleRowIndex((ruleRowIndex + 1) % numRuleRows);
    }),
  );

export default combineEpics(
  moveEpic,
  endRuleRowEpic,
  endRuleArrayEpic,
  setRuleArrayEpic,
  noMoreMovesEpic,
);
