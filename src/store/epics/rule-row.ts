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
    delay(1000),
    switchMap(() => {
      const actions: RootAction[] = [
        removeBoardObject(
          state$.value.ruleRow.totalMoveHistory[state$.value.ruleRow.totalMoveHistory.length - 1]
            .dragged,
        ),
        resumeGame(),
      ];
      if (
        allAtomCountersZeroSelector(state$.value) &&
        state$.value.ruleRow.ruleRowIndex === state$.value.ruleRow.numRuleRows - 1
      ) {
        actions.push(endRuleArray());
      } else if (allAtomCountersZeroSelector(state$.value)) {
        actions.push(endRuleRow());
      }

      return actions;
    }),
  );

// const pauseEpic: RootEpic = (action$, state$) =>
//   action$.pipe(
//     filter(isActionOf(pauseGame)),
//     delay(1000),
//     switchMap(() => {
//       const actions: RootAction[] = [
//         removeBoardObject(
//           state$.value.ruleRow.totalMoveHistory[state$.value.ruleRow.totalMoveHistory.length - 1]
//             .dragged,
//         ),
//       ];
//       if (
//         allAtomCountersZeroSelector(state$.value) &&
//         state$.value.ruleRow.ruleRowIndex === state$.value.ruleRow.numRuleRows - 1
//       ) {
//         actions.push(endRuleArray());
//       } else if (allAtomCountersZeroSelector(state$.value)) {
//         actions.push(endRuleRow());
//       }
//
//       return actions;
//     }),
//   );

// const removeBoardObjectEpic: RootEpic = (action$, state$) =>
//   action$.pipe(
//     filter(isActionOf(removeBoardObject)),
//     filter(() => noMoreMovesSelector(state$.value)),
//     map(() => {
//       if (state$.value.ruleRow.ruleRowIndex === state$.value.ruleRow.numRuleRows - 1) {
//         return endRuleArray();
//       }
//       return setRuleRowIndex(state$.value.ruleRow.ruleRowIndex);
//     }),
//   );

const noMoreMovesEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([setRuleRowIndex, removeBoardObject])),
    filter(() => {
      return noMoreMovesSelector(state$.value);
    }),
    map(() => {
      if (state$.value.ruleRow.ruleRowIndex === state$.value.ruleRow.numRuleRows - 1) {
        return endRuleArray();
      }
      return setRuleRowIndex(state$.value.ruleRow.ruleRowIndex + 1);
    }),
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

const ruleRowEpic: RootEpic = (action$) => action$.pipe(filter(isActionOf(endRuleRow)));

export default combineEpics(
  moveEpic,
  readRuleArrayEpic,
  ruleRowEpic,
  endRuleArrayEpic,
  setRuleArrayEpic,
  noMoreMovesEpic,
);
