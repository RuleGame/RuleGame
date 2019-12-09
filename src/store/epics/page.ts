import { combineEpics } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { goToPage } from '../actions/page';
import { endRuleArray, setRuleRowIndex } from '../actions/rule-row';
import { RootEpic } from '../../@types/epic';

const goToPageEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(goToPage)),
    filter((action) => action.payload.page === 'RuleGame'),
    map(() => (state$.value.ruleRow.numRuleRows > 0 ? setRuleRowIndex(0) : endRuleArray())),
  );

export default combineEpics(goToPageEpic);
