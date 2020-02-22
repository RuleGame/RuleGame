import { combineEpics } from 'redux-observable';
import { filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { RootEpic } from '../../@types/epic';
import { addGame, enterGame, loadGames } from '../actions/games';
import { BoardObjectType, ExportedFile, RuleArray } from '../../@types';
import { parseRuleArray } from '../../utils/atom-parser';
import { goToPage } from '../actions/page';
import {
  boardObjectsArraysByIdSelector,
  gamesByIdSelector,
  ruleArraysByIdSelector,
} from '../selectors';
import { addLayer, removeLayer } from '../actions/layers';
import { loadRuleArray } from '../actions/rule-row';
import randomObjectsCreator from './__helpers__/objects-creator';
import { addNotification } from '../actions/notifications';
import { setBoardObjectsArray, setGameId } from '../actions/game';

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
    // switchMap((res) => {
    //   return new Promise<any>((resolve) => setTimeout(() => resolve(res), 3000));
    // }),
  );

const enterGameEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(enterGame)),
    switchMap(({ payload: { id } }) => {
      const game = gamesByIdSelector(state$.value)[id];
      if (game.ruleArray === undefined) {
        return [
          addLayer(
            `Game ${game.name} is missing its rule array.`,
            '',
            [
              {
                key: 'close',
                label: 'Close',
                action: removeLayer('missing-rule-array'),
              },
            ],
            'missing-rule-array',
          ),
        ];
      }
      const ruleArray = ruleArraysByIdSelector(state$.value)[game.ruleArray];

      if (game.useRandomBoardObjects) {
        return [
          setGameId(id),
          loadRuleArray(
            randomObjectsCreator(game.numRandomBoardObjects),
            ruleArray.value,
            ruleArray.stringified,
            ruleArray.order,
          ),
          goToPage('RuleGame'),
        ];
      }
      if (game.boardObjectsArrays.length === 0) {
        return [
          addLayer(
            `Game ${game.name} is missing board objects arrays.`,
            '',
            [
              {
                key: 'close',
                label: 'Close',
                action: removeLayer('missing-rule-array'),
              },
            ],
            'missing-rule-array',
          ),
        ];
      }

      const boardObjectsArray = boardObjectsArraysByIdSelector(state$.value)[
        game.boardObjectsArrays[0]
      ];
      return [
        setGameId(id),
        setBoardObjectsArray(0),
        loadRuleArray(
          boardObjectsArray.value,
          ruleArray.value,
          ruleArray.stringified,
          ruleArray.order,
        ),
        goToPage('RuleGame'),
      ];
    }),
  );

const addGameEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addGame)),
    map((action) => addNotification(`Added game: ${action.payload.name}`)),
  );

export default combineEpics(loadGamesEpic, enterGameEpic, addGameEpic);
