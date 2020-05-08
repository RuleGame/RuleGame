import { isActionOf } from 'typesafe-actions';
import { filter, switchMap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { RootEpic } from '../../@types/epic';
import { nextBoardObjectsArray, setBoardObjectsArray } from '../actions/game';
import {
  boardObjectsArraysByIdSelector,
  currBoardObjectsArrayIndexSelector,
  currGameIdSelector,
  gamesByIdSelector,
  ruleArraysByIdSelector,
} from '../selectors';
import { loadRuleArray } from '../actions/rule-row';
import randomObjectsCreator from './__helpers__/objects-creator';
import { goToPage } from '../actions/page';

const nextBoardArrayObjectsEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(nextBoardObjectsArray)),
    switchMap(() => {
      const game = gamesByIdSelector(state$.value)[currGameIdSelector(state$.value) as string];
      const ruleArray = ruleArraysByIdSelector(state$.value)[game.ruleArray as string];

      if (game.useRandomBoardObjects) {
        return [
          loadRuleArray(
            randomObjectsCreator(game.numRandomBoardObjects),
            ruleArray.value,
            ruleArray.stringified,
            game.id,
            ruleArray.order,
          ),
          goToPage('RuleGame'),
        ];
      }

      const currIndex = currBoardObjectsArrayIndexSelector(state$.value) as number;
      return [
        setBoardObjectsArray((currIndex + 1) % game.boardObjectsArrays.length),
        loadRuleArray(
          boardObjectsArraysByIdSelector(state$.value)[game.boardObjectsArrays[currIndex]].value,
          ruleArray.value,
          ruleArray.stringified,
          game.id,
          ruleArray.order,
        ),
        goToPage('RuleGame'),
      ];
    }),
  );
export default combineEpics(nextBoardArrayObjectsEpic);
