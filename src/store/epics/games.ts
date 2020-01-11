import { combineEpics } from 'redux-observable';
import { filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { RootEpic } from '../../@types/epic';
import { addGame, enterGame } from '../actions/games';
import { parseRuleArray } from '../../utils/atom-parser';
import { loadRuleArray } from '../actions/rule-row';
import {
  boardObjectsArraysByIdSelector,
  gamesByIdSelector,
  ruleArraysByIdSelector,
} from '../selectors';
import { addRuleArray } from '../actions/rule-arrays';
import { addBoardObjectsArray } from '../actions/board-objects-arrays';

// TODO: Dispatch addRuleArray and addBoardObjectsArrays requests to use their Epics instead
const addGameRequestEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addGame.request)),
    switchMap((action) => {
      let parsedBoardObjectsArray;
      try {
        parsedBoardObjectsArray = JSON.parse(action.payload.boardObjectsArray);
      } catch (error) {
        return [addGame.failure(error), addBoardObjectsArray.failure(error)];
      }
      let parsedRuleArray;
      try {
        parsedRuleArray = parseRuleArray(action.payload.ruleArray);
      } catch (error) {
        return [addGame.failure(error), addRuleArray.failure(error)];
      }

      return [
        addGame.success(
          action.payload.name,
          parsedRuleArray,
          action.payload.ruleArray,
          parsedBoardObjectsArray,
          action.payload.boardObjectsArray,
        ),
      ];
    }),
  );

const enterGameEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(enterGame)),
    map((action) => {
      const game = gamesByIdSelector(state$.value)[action.payload.id];
      const boardObjectsArray = boardObjectsArraysByIdSelector(state$.value)[
        game.boardObjectsArray
      ];
      const ruleArray = ruleArraysByIdSelector(state$.value)[game.ruleArray];
      return loadRuleArray(boardObjectsArray.value, ruleArray.value, ruleArray.stringified);
    }),
  );

export default combineEpics(addGameRequestEpic, enterGameEpic);
