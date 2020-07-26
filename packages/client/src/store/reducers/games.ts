import { getType } from 'typesafe-actions';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { RootAction } from '../actions';
import removeFirst from '../../utils/removeFirst';
import {
  addGame,
  loadGames,
  removeGame,
  setGameBoardObjectsArrays,
  setGameRuleArray,
} from '../actions/games';
import { PersistKeys, PersistVersions } from './__helpers__/PersistConstants';
import { Game } from '../../@types';
import { addBoardObjectsArray } from '../actions/board-objects-arrays';

export type State = {
  byId: {
    [id: string]: Game;
  };
  allIds: string[];
};

export const initialState: State = {
  byId: {},
  allIds: [],
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(addGame): {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            id: action.payload.id,
            boardObjectsArrays: [...action.payload.boardObjectsArrays],
            name: action.payload.name,
            ruleArray: action.payload.ruleArray,
            useRandomBoardObjects: action.payload.useRandomBoardObjects,
            numRandomBoardObjects: action.payload.numRandomBoardObjects,
            numConsecutiveSuccessfulMovesBeforePromptGuess:
              action.payload.numConsecutiveSuccessfulMovesBeforePromptGuess,
            restartIfNotCleared: action.payload.restartIfNotCleared,
            numDisplaysLimit: action.payload.numDisplaysLimit,
            showStackMemoryOrder: action.payload.showStackMemoryOrder,
            showGridMemoryOrder: action.payload.showGridMemoryOrder,
          },
        },
        allIds: [...state.allIds, action.payload.id],
      };
    }

    case getType(removeGame): {
      const { [action.payload.id]: _, ...newById } = state.byId;

      return {
        ...state,
        byId: newById,
        allIds: removeFirst(state.allIds, action.payload.id),
      };
    }

    case getType(setGameRuleArray): {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            ruleArray: action.payload.ruleArray,
          },
        },
      };
    }

    case getType(setGameBoardObjectsArrays): {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            boardObjectsArrays: [...action.payload.boardObjectsArrays],
          },
        },
      };
    }

    case getType(loadGames.success): {
      const allIdsSet = new Set(state.allIds);

      return {
        ...state,
        byId: {
          ...state.byId,
          ...action.payload.games,
        },
        allIds: [
          ...state.allIds,
          ...Object.values(action.payload.games)
            .filter((game) => !allIdsSet.has(game.id))
            .map((game) => game.id),
        ],
      };
    }

    case getType(addBoardObjectsArray.success): {
      return {
        ...state,
        byId: Object.entries(state.byId).reduce(
          (acc, [id, curr]) => ({
            ...acc,
            [id]: {
              ...curr,
              boardObjectsArrays: [...curr.boardObjectsArrays, action.payload.id],
            },
          }),
          {},
        ),
      };
    }

    default:
      return state;
  }
};

export default persistReducer(
  {
    version: PersistVersions[PersistKeys.GAMES],
    key: PersistKeys.GAMES,
    storage,
  },
  reducer,
);
