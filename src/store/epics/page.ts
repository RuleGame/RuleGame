import { combineEpics, Epic } from 'redux-observable';
import { catchError, filter, map } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { gameToRule } from '../../constants';
import { RootAction } from '../actions';
// import { setRule } from '../actions/game';
import { goToPage } from '../actions/page';
import { RootState } from '../reducers';
import { Game } from '../../@types';
import ruleArray from '../../assets/rule-array.txt';
import {
  endRuleArray,
  readRuleArray,
  ruleArrayParseFailure,
  setRuleArray,
  setRuleRowIndex,
} from '../actions/rule-row';
import randomObjectsCreator from './__helpers__/objects-creator';
import ruleParser from '../../utils/atom-parser';
import { of } from 'rxjs';

const goToPageEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(goToPage)),
    filter((action) => action.payload.page === 'RuleGame'),
    map(() => (state$.value.ruleRow.numRuleRows > 0 ? setRuleRowIndex(0) : endRuleArray())),
  );

export default combineEpics(goToPageEpic);
