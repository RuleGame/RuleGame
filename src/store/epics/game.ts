import { range, shuffle, zip } from 'lodash';
import { Epic } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { setPositions } from '../../components/__helpers__/positions';
import { blueSquareAnyBucket, closestBucket } from '../../components/__helpers__/rule-set-mappers';
import { RootAction } from '../actions';
import { initBoard, move } from '../actions/game';
import { RootState } from '../reducers';
import { allCheckedSelector, numBoardObjectsSelector, ruleSelector } from '../selectors/index';

export const gameEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(move)),
    filter(() => allCheckedSelector(state$.value)),
    map(() => {
      const state = state$.value;
      const rule = ruleSelector(state);
      const numBoardObjects = numBoardObjectsSelector(state);

      // TODO: Move to constants file
      const minX = 1;
      const minY = 1;

      return initBoard(
        rule,
        // TODO: Don't use hardcoded conditional checking
        rule === 'clockwise' ? blueSquareAnyBucket : closestBucket,
        setPositions(
          (zip(shuffle(range(numBoardObjects + 1)), shuffle(range(numBoardObjects + 1))) as [
            number,
            number,
          ][]).reduce<{ x: number; y: number }[]>(
            (acc, curr) => [...acc, { x: curr[0] + minX, y: curr[1] + minY }],
            [],
          ),
        ),
      );
    }),
  );
