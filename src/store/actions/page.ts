import { createAction } from 'typesafe-actions';
import { Page, Game } from '../../@types';

export const goToPage = createAction('page/GO_TO_PAGE', (action) => (page: Page, game?: Game) =>
  action({ page, game }),
);
