import { Optional } from 'utility-types';
import { getType } from 'typesafe-actions';
import produce from 'immer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { HistoryLog } from '../../@types';
import { RootAction } from '../actions';
import { logMove, setPlayerName } from '../actions/history';
import { loadRuleArray } from '../actions/rule-row';
import { PersistKeys, PersistVersions } from './__helpers__/PersistConstants';

export type State = Optional<HistoryLog, 'playerName'>;

export const initialState: State = {
  playerName: undefined,
  displays: [],
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(setPlayerName): {
      return {
        ...state,
        playerName: action.payload.playerName,
      };
    }
    case getType(loadRuleArray): {
      return {
        ...state,
        displays: [
          ...state.displays,
          {
            game: action.payload.gameId,
            time: action.payload.time,
            boardObjectsArray: action.payload.boardObjects,
            dropAttempts: [],
          },
        ],
      };
    }
    case getType(logMove): {
      // Assumes the move is for the latest display
      return produce(state, (draftState) => {
        const latestDisplay = draftState.displays[draftState.displays.length - 1];
        if (latestDisplay) {
          latestDisplay.dropAttempts.push({
            ...action.payload.dropAttempt,
            time: action.payload.time,
          });
        }
      });
    }

    default:
      return state;
  }
};

export default persistReducer(
  {
    version: PersistVersions[PersistKeys.HISTORY],
    key: PersistKeys.HISTORY,
    storage,
  },
  reducer,
);
