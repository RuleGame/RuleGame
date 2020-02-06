import { combineEpics } from 'redux-observable';
import { filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { RootEpic } from '../../@types/epic';
import { loadGames } from '../actions/games';
import { BoardObjectType, ExportedFile, RuleArray } from '../../@types';
import { parseRuleArray } from '../../utils/atom-parser';

// TODO: Dispatch addRuleArray and addBoardObjectsArrays requests to use their Epics instead
const loadGamesEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(loadGames.request)),
    switchMap(async ({ payload: { id, file } }) => {
      const text = await new Response(new Blob([file])).text();
      return [id, text] as const;
    }),
    map(([id, text]) => {
      try {
        const {
          boardObjectsArrays: boardObjectsArraysWithoutStringified,
          games,
          ruleArrays: ruleArraysWithoutValues,
        }: ExportedFile = JSON.parse(text);
        const ruleArrays = Object.entries(ruleArraysWithoutValues).reduce<{
          [id: string]: { id: string; name: string; stringified: string; value: RuleArray };
        }>(
          (acc, [id, curr]) => ({
            ...acc,
            [id]: {
              ...curr,
              value: parseRuleArray(curr.stringified),
            },
          }),
          {},
        );
        const boardObjectsArrays = Object.entries(boardObjectsArraysWithoutStringified).reduce<{
          [id: string]: { id: string; name: string; stringified: string; value: BoardObjectType[] };
        }>(
          (acc, [id, curr]) => ({
            ...acc,
            [id]: {
              ...curr,
              stringified: JSON.stringify(curr),
            },
          }),
          {},
        );
        return loadGames.success(games, ruleArrays, boardObjectsArrays, id);
      } catch (error) {
        return loadGames.failure(error, id);
      }
    }),
  );

export default combineEpics(loadGamesEpic);
