import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { goToPage } from '../actions/page';
import { Page } from '../../constants/Page';

type State = {
  page: Page;
};

const initialState: State = {
  page: Page.CONSENT,
};

const reducer = (state = initialState, action: RootAction): State => {
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
