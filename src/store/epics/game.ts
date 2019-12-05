// import { Epic, combineEpics } from 'redux-observable';
// import { filter, map, withLatestFrom } from 'rxjs/operators';
// import { isActionOf } from 'typesafe-actions';
// import { blueSquareAnyBucket, nearestBucket } from '../../components/__helpers__/rule-set-mappers';
// import { RootAction } from '../actions';
// import { initBoard, move, setRule } from '../actions/game';
// import { RootState } from '../reducers';
// import { allCheckedSelector, ruleSelector } from '../selectors';
//
// const initBoardEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
//   action$.pipe(
//     filter(isActionOf(move)),
//     withLatestFrom(state$),
//     filter(([, state]) => allCheckedSelector(state)),
//     map(([, state]) => {
//       const rule = ruleSelector(state);
//
//       return initBoard(
//         // TODO: Don't use hardcoded conditional checking
//         rule === 'clockwise' ? blueSquareAnyBucket : nearestBucket,
//       );
//     }),
//   );
//
// const setRuleEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
//   action$.pipe(
//     filter(isActionOf(setRule)),
//     withLatestFrom(state$),
//     map(([action]) => {
//       switch (action.payload.rule) {
//         case 'clockwise':
//           return initBoard(blueSquareAnyBucket);
//         case 'nearest':
//           return initBoard(nearestBucket);
//         // no default
//       }
//     }),
//   );
//
// export default combineEpics(initBoardEpic, setRuleEpic);
export default () => {};
