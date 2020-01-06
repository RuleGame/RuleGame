import { isActionOf } from 'typesafe-actions';
import { catchError, filter, map } from 'rxjs/operators';
import shortid from 'shortid';
import { of } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { addRuleArray } from '../actions/rule-arrays';
import { RootEpic } from '../../@types/epic';
import { parseRuleArray } from '../../utils/atom-parser';
import { addLayer, removeLayer } from '../actions/layers';

const addRuleArrayRequestEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addRuleArray.request)),
    map((action) =>
      addRuleArray.success(
        shortid(),
        parseRuleArray(action.payload.rawRuleArray),
        action.payload.rawRuleArray,
      ),
    ),
    catchError((error) => of(addRuleArray.failure(error))),
  );

const addRuleArrayFailureEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addRuleArray.failure)),
    map((action) => {
      const layerId = shortid();

      return addLayer(
        'Error Parsing Rule Array:',
        action.payload.error.message,
        [{ key: 'close', label: 'Close', action: removeLayer(layerId) }],
        layerId,
      );
    }),
  );

export default combineEpics(addRuleArrayRequestEpic, addRuleArrayFailureEpic);
