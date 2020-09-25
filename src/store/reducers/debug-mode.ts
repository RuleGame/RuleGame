import { getType } from 'typesafe-actions';
import { DEBUG_ENABLED } from '../../constants/env';
import { RootAction } from '../actions';
import { setDebugMode } from '../actions/debug-mode';

type State = boolean;

const initialState = DEBUG_ENABLED;

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(setDebugMode):
      return action.payload.debugMode;
    default:
      return state;
  }
};

export default reducer;
