import { combineEpics } from 'redux-observable';
import { concatMap, delay, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { RootAction } from '../actions';
import {
  endRuleArray,
  endRuleRow,
  move,
  pauseGame,
  readRuleArray,
  removeBoardObject,
  resumeGame,
  setRuleArray,
  setRuleRowIndex,
} from '../actions/rule-row';
import { allAtomCountersZeroSelector, noMoreMovesSelector } from '../selectors';
import { RootEpic } from '../../@types/epic';
import { goToPage } from '../actions/page';
import randomObjectsCreator from './__helpers__/objects-creator';
import ruleArray from '../../assets/rule-array.txt';
import ruleParser from '../../utils/atom-parser';
import { concat, defer, of } from 'rxjs';

const fileMapping: { [fileName: string]: string } = {
  'rule-array.txt': ruleArray,
};

const moveEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(move)),
    filter(() => state$.value.ruleRow.lastMoveSuccessful),
    // map(() => pauseGame()),
    delay(1000),
    switchMap(() => [
      removeBoardObject(
        state$.value.ruleRow.totalMoveHistory[state$.value.ruleRow.totalMoveHistory.length - 1]
          .dragged,
      ),
      resumeGame(),
    ]),
  );
//
// const noMoreMovesEpic: RootEpic = (action$, state$) =>
//   action$.pipe(
//     filter(isActionOf([setRuleRowIndex, removeBoardObject])),
//     filter(() =>  noMoreMovesSelector(state$.value)),
//     map(() => {
//       if (state$.value.ruleRow.ruleRowIndex === state$.value.ruleRow.numRuleRows - 1) {
//         return endRuleArray();
//       }
//       return setRuleRowIndex(state$.value.ruleRow.ruleRowIndex + 1);
//     }),
//   );

const noMoreMovesEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([setRuleRowIndex, removeBoardObject])),
    filter(() => noMoreMovesSelector(state$.value)),
    map(() => endRuleRow()),
  );

const readRuleArrayEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(readRuleArray)),
    map((action) =>
      setRuleArray(
        randomObjectsCreator(5),
        fileMapping[action.payload.fileName]
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .map((ruleRow) => ruleParser(ruleRow)),
        fileMapping[action.payload.fileName].split('\n'),
      ),
    ),
  );

const setRuleArrayEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(setRuleArray)),
    map(() => (state$.value.ruleRow.numRuleRows > 0 ? setRuleRowIndex(0) : endRuleArray())),
  );

const endRuleArrayEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(endRuleArray)),
    map(() => goToPage('Entrance')),
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
  readRuleArrayEpic,
  endRuleRowEpic,
  endRuleArrayEpic,
  setRuleArrayEpic,
  noMoreMovesEpic,
);
