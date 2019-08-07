import { createAction } from 'typesafe-actions';
import { Page } from '../../@types';

export const goToPage = createAction('page/GO_TO_PAGE', (action) => (page: Page) =>
  action({ page }),
);
