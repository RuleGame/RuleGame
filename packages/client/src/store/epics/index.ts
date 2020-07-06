import { combineEpics } from 'redux-observable';
import { REHYDRATE } from 'redux-persist/es/constants';
import { filter, map } from 'rxjs/operators';
import page from './page';
import ruleRow from './rule-row';
import ruleArrays from './rule-arrays';
import boardObjectsArrays from './board-object-arrays';
import games from './games';
import game from './game';
import { RootEpic } from '../../@types/epic';
import { loadGames } from '../actions/games';
import games2138 from '../../assets/Games.21-38.json';

const goToPageEpic: RootEpic = (action$) =>
  action$.pipe(
    // Third party actions such as persist are not included in RootAction
    // so just cast the types to a string
    filter((action) => (action.type as string) === REHYDRATE),
    map(() => loadGames.request(new File([JSON.stringify(games2138)], 'temp'))),
  );

export const rootEpic = combineEpics(
  page,
  ruleRow,
  ruleArrays,
  boardObjectsArrays,
  games,
  game,
  goToPageEpic,
);
