import { combineEpics } from 'redux-observable';
import { delay, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
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
import { noMoreMovesSelector } from '../selectors';
import { RootEpic } from '../../@types/epic';
import { goToPage } from '../actions/page';

const moveEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(move)),
    filter(() => state$.value.ruleRow.lastMoveSuccessful),
    delay(1000),
    switchMap(() => [
      removeBoardObject(
        state$.value.ruleRow.totalMoveHistory[state$.value.ruleRow.totalMoveHistory.length - 1]
          .dragged,
      ),
      resumeGame(),
    ]),
  );

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
