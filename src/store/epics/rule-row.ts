import { combineEpics } from 'redux-observable';
import { delay, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import shortid from 'shortid';
import {
  completeGame,
  endRuleArray,
  endRuleRow,
  move,
  removeBoardObject,
  resumeGame,
  loadRuleArrayRequest,
  setRuleRowIndex,
  loadRuleArraySuccess,
  loadRuleArrayFailure,
} from '../actions/rule-row';
import { noMoreMovesSelector } from '../selectors';
import { RootEpic } from '../../@types/epic';
import { goToPage } from '../actions/page';
import parseRow from '../../utils/atom-parser';
import { addLayer, removeLayer } from '../actions/layers';

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
    filter(isActionOf(loadRuleArraySuccess)),
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

const loadRuleArrayEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(loadRuleArrayRequest)),
    mergeMap((action) => {
      try {
        return [
          loadRuleArraySuccess(
            action.payload.boardObjects,
            action.payload.rawRuleArrayString
              .split('\n')
              .filter((line) => line.trim().length > 0)
              .map((ruleRow) => parseRow(ruleRow)),
            action.payload.rawRuleArrayString,
          ),
        ];
      } catch (e) {
        const layerId = shortid();

        return [
          addLayer(
            'Error Parsing Rule Array:',
            e.message,
            [{ key: 'close', label: 'Close', action: removeLayer(layerId) }],
            layerId,
          ),
          loadRuleArrayFailure(e),
        ];
      }
    }),
  );

export default combineEpics(
  moveEpic,
  endRuleRowEpic,
  endRuleArrayEpic,
  setRuleArrayEpic,
  noMoreMovesEpic,
  loadRuleArrayEpic,
);
