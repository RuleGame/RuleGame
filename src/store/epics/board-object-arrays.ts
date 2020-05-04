import { isActionOf } from 'typesafe-actions';
import { filter, map } from 'rxjs/operators';
import shortid from 'shortid';
import { combineEpics } from 'redux-observable';
import { Optional } from 'utility-types';
import { RootEpic } from '../../@types/epic';
import { addLayer, removeLayer } from '../actions/layers';
import { addBoardObjectsArray } from '../actions/board-objects-arrays';
import { addNotification } from '../actions/notifications';
import { BoardObjectType } from '../../@types';
import { xYToPosition } from '../../utils/atom-match';

const addBoardObjectsArrayRequestEpic: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(addBoardObjectsArray.request)),
    map((action) => {
      try {
        return addBoardObjectsArray.success(
          shortid(),
          action.payload.name,
          (JSON.parse(action.payload.boardObjectsArrayString) as Optional<
            BoardObjectType,
            'id'
          >[]).map<BoardObjectType>((boardObject) =>
            boardObject.id
              ? (boardObject as BoardObjectType)
              : {
                  ...boardObject,
                  id: String(xYToPosition(boardObject.x, boardObject.y)),
                },
          ),
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
    map((action) => addNotification(`Added new board objects array: ${action.payload.name}`)),
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
