import { range, shuffle, zip } from 'lodash';
import { Epic, combineEpics } from 'redux-observable';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { setPositions } from '../../components/__helpers__/positions';
import { blueSquareAnyBucket, nearestBucket } from '../../components/__helpers__/rule-set-mappers';
import { RootAction } from '../actions';
import { initBoard, move, setRule } from '../actions/game';
import { RootState } from '../reducers';
import { allCheckedSelector, numBoardObjectsSelector, ruleSelector } from '../selectors/index';

const initBoardEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(move)),
    withLatestFrom(state$),
    filter(([, state]) => allCheckedSelector(state)),
    map(([, state]) => {
      const rule = ruleSelector(state);
      const numBoardObjects = numBoardObjectsSelector(state);

      // TODO: Move to constants file
      const minX = 1;
      const minY = 1;

      return initBoard(
        // TODO: Don't use hardcoded conditional checking
        rule === 'clockwise' ? blueSquareAnyBucket : nearestBucket,
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

const setRuleEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(setRule)),
    withLatestFrom(state$),
    map(([action, state]) => {
      const numBoardObjects = numBoardObjectsSelector(state);
      // TODO: Move to constants file
      const minX = 1;
      const minY = 1;

      switch (action.payload.rule) {
        case 'clockwise':
          return initBoard(
            blueSquareAnyBucket,
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
        case 'nearest':
          return initBoard(
            nearestBucket,
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
        // no default
      }
    }),
  );

export default combineEpics(initBoardEpic, setRuleEpic);
