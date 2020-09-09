import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { nextBoardObjectsArray, setBoardObjectsArray, setGameId } from '../actions/game';

export type State = {
  currBoardObjectsArrayIndex?: number;
  currGameId?: string;
  numDisplaysCompleted: number;
};

export const initialState: State = {
  currBoardObjectsArrayIndex: undefined,
  currGameId: undefined,
  numDisplaysCompleted: 0,
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(setGameId): {
      return {
        ...state,
        currGameId: action.payload.gameId,
        currBoardObjectsArrayIndex: 0,
        numDisplaysCompleted: 0,
      };
    }

    case getType(setBoardObjectsArray): {
      return {
        ...state,
        currBoardObjectsArrayIndex: action.payload.index,
      };
    }

    case getType(nextBoardObjectsArray): {
      return {
        ...state,
        numDisplaysCompleted: state.numDisplaysCompleted + 1,
      };
    }

    default:
      return state;
  }
};

export default reducer;
