import { combineEpics, Epic } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { gameToRule } from '../../constants';
import { RootAction } from '../actions';
import { setRule } from '../actions/game';
import { goToPage } from '../actions/page';
import { RootState } from '../reducers';
import { Game } from '../../@types';

const goToPageEpic: Epic<RootAction, RootAction, RootState> = (action$) =>
  action$.pipe(
    filter(isActionOf(goToPage)),
    filter((action) => action.payload.game !== undefined),
    map((action) => setRule(gameToRule[action.payload.game as Game])),
  );

export default combineEpics(goToPageEpic);
