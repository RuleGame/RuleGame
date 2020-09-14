import { createSelector } from 'reselect';
import shortid from 'shortid';
import { BoardObjectType, ExportedFile } from '../../@types';
import { FILE_VERSION } from '../../constants';
import { ruleArraysByIdSelector } from './rule-arrays';
import { boardObjectsArraysByIdSelector } from './board-object-arrays';
import { gamesByIdSelector } from './games';

export const exportedGamesSelector = createSelector(
  [gamesByIdSelector, ruleArraysByIdSelector, boardObjectsArraysByIdSelector],
  (gamesById, ruleArraysById, boardObjectsArraysById) =>
    JSON.stringify({
      id: shortid(),
      version: FILE_VERSION,
      games: gamesById,
      ruleArrays: Object.entries(ruleArraysById).reduce<{
        [id: string]: { id: string; name: string; stringified: string };
      }>((acc, [id, curr]) => {
        const { value: _, ...rest } = curr;
        acc[id] = rest;
        return acc;
      }, {}),
      boardObjectsArrays: Object.entries(boardObjectsArraysById).reduce<{
        [id: string]: { id: string; name: string; value: BoardObjectType[] };
      }>((acc, [id, curr]) => {
        const { stringified: _, ...rest } = curr;
        acc[id] = rest;
        return acc;
      }, {}),
    } as ExportedFile),
);
