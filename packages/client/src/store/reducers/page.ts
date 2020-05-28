import { getType } from 'typesafe-actions';
import { Page } from '../../@types';
import { RootAction } from '../actions';
import { goToPage } from '../actions/page';

type State = {
  page: Page;
};

const initialState: State = {
  page: 'Entrance',
};

const reducer = (state = initialState, action: RootAction): State => {
  // noinspection JSRedundantSwitchStatement
  switch (action.type) {
    case getType(goToPage):
      return {
        ...state,
        page: action.payload.page,
      };
    default:
      return state;
  }
};

export default reducer;
