import { isActionOf } from 'typesafe-actions';
import { filter, map } from 'rxjs/operators';
import shortid from 'shortid';
import { combineEpics } from 'redux-observable';
import { addRuleArray } from '../actions/rule-arrays';
import { RootEpic } from '../../@types/epic';
import { parseRuleArray } from '../../utils/atom-parser';
import { addLayer, removeLayer } from '../actions/layers';
import { addNotification } from '../actions/notifications';

const addRuleArrayRequestEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addRuleArray.request)),
    map((action) => {
      try {
        return addRuleArray.success(
          action.payload.id,
          action.payload.name,
          parseRuleArray(action.payload.rawRuleArray),
          action.payload.rawRuleArray,
          action.payload.rawOrder ? (JSON.parse(action.payload.rawOrder) as number[]) : undefined,
        );
      } catch (error) {
        return addRuleArray.failure(error);
      }
    }),
  );

const addRuleArraySuccessEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addRuleArray.success)),
    map((action) => addNotification(`Added new rule array: ${action.payload.name}`)),
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

export default combineEpics(
  addRuleArrayRequestEpic,
  addRuleArrayFailureEpic,
  addRuleArraySuccessEpic,
);
