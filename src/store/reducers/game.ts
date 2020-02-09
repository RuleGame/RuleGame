import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { setBoardObjectsArray, setGameId } from '../actions/game';

export type State = {
  currBoardObjectsArrayIndex?: number;
  currGameId?: string;
};

export const initialState: State = {
  currBoardObjectsArrayIndex: undefined,
  currGameId: undefined,
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(setGameId): {
      return {
        ...state,
        currGameId: action.payload.gameId,
        currBoardObjectsArrayIndex: 0,
      };
    }

    case getType(setBoardObjectsArray): {
      return {
        ...state,
        currBoardObjectsArrayIndex: action.payload.index,
      };
    }

    default:
      return state;
  }
};

export default reducer;
