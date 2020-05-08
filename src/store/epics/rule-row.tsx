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
} from '../selectors';
import { RootEpic } from '../../@types/epic';
import { goToPage } from '../actions/page';
import { numConsecutiveSuccessfulMovesSelector } from '../selectors/rule-row';
import { addLayer, removeLayer } from '../actions/layers';
import HappyFace from '../../assets/smiley-face.png';
import { RootAction } from '../actions';

export const FEEDBACK_DURATION = 1000;

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
            <Heading>Would you like to guess the rule?</Heading>,
            [
              {
                action: (layerId) => removeLayer(layerId),
                label: 'close',
              },
            ],
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
    map(() =>
      state$.value.ruleRow.ruleRowIndex === state$.value.ruleRow.numRuleRows - 1
        ? endRuleArray()
        : setRuleRowIndex(state$.value.ruleRow.ruleRowIndex + 1),
    ),
  );

export default combineEpics(
  moveEpic,
  endRuleRowEpic,
  endRuleArrayEpic,
  setRuleArrayEpic,
  noMoreMovesEpic,
);
