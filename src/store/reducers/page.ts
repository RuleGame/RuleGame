import { getType } from 'typesafe-actions';
import { RootAction } from '../actions';
import { goToPage, nextPage } from '../actions/page';
import { Page } from '../../constants/Page';
import { PAGE_ORDER } from '../../constants';

type State = {
  pageIndex: number;
  page: Page;
};

const initialState: State = {
  pageIndex: 0,
  page: PAGE_ORDER[0],
};

const reducer = (state = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(goToPage):
      return {
        ...state,
        pageIndex: PAGE_ORDER.indexOf(action.payload.page),
        page: action.payload.page,
      };

    case getType(nextPage):
      return {
        ...state,
        pageIndex: state.pageIndex + 1,
        page: PAGE_ORDER[state.pageIndex + 1],
      };

    default:
      return state;
  }
};

export default reducer;
