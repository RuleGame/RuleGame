import { createAction } from 'typesafe-actions';
import { Page, Game } from '../../@types';

export const goToPage = createAction(
  'page/GO_TO_PAGE',
  (action) => (page: Page, filename?: string) => action({ page, filename }),
);
