import { combineEpics, Epic } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { gameToRule } from '../../constants';
import { RootAction } from '../actions';
// import { setRule } from '../actions/game';
import { goToPage } from '../actions/page';
import { RootState } from '../reducers';
import { Game } from '../../@types';
import ruleArray from '../../assets/rule-array.txt';
import { readRuleArray, setRuleArray } from '../actions/rule-row';

const goToPageEpic: Epic<RootAction, RootAction, RootState> = (action$) =>
  action$.pipe(
    filter(isActionOf(goToPage)),
    filter((action) => action.payload.filename !== undefined),
    map((action) => readRuleArray(action.payload.filename as string)),
  );

export default combineEpics(goToPageEpic);
