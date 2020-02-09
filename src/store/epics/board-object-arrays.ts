import { isActionOf } from 'typesafe-actions';
import { filter, map } from 'rxjs/operators';
import shortid from 'shortid';
import { combineEpics } from 'redux-observable';
import { RootEpic } from '../../@types/epic';
import { addLayer, removeLayer } from '../actions/layers';
import { addBoardObjectsArray } from '../actions/board-objects-arrays';
import { addNotification } from '../actions/notifications';
import { idHelper } from '../../utils/id-helper';

const addBoardObjectsArrayRequestEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addBoardObjectsArray.request)),
    map((action) => {
      try {
        return addBoardObjectsArray.success(
          shortid(),
          action.payload.name,
          JSON.parse(action.payload.boardObjectsArrayString),
          action.payload.boardObjectsArrayString,
        );
      } catch (error) {
        return addBoardObjectsArray.failure(error, action.payload.boardObjectsArrayString);
      }
    }),
  );

const addBoardObjectArraysSuccessEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addBoardObjectsArray.success)),
    map((action) => {
      return idHelper((id) =>
        addNotification(
          `Added new board objects array: ${action.payload.name}`,
          [
            {
              key: 'close',
              action: removeLayer(id),
              label: 'Close',
            },
          ],
          id,
        ),
      );
    }),
  );

const addBoardObjectArraysFailureEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addBoardObjectsArray.failure)),
    map((action) => {
      const layerId = shortid();

      return addLayer(
        'Error Parsing Board Objects:',
        `${action.payload.boardObjectsArrayString}\n${action.payload.error.message}`,
        [{ key: 'close', label: 'Close', action: removeLayer(layerId) }],
        layerId,
      );
    }),
  );

export default combineEpics(
  addBoardObjectsArrayRequestEpic,
  addBoardObjectArraysFailureEpic,
  addBoardObjectArraysSuccessEpic,
);
