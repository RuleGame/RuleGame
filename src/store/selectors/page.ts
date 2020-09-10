import { RootState } from '../reducers';

export const pageSelector = (state: RootState) => state.page.page;
