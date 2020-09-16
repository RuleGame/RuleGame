import { createAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { Page } from '../../constants/Page';

export const goToPage = createAction('page/GO_TO_PAGE', (page: Page) => ({ page }))();

export const nextPage = createAction('page/NEXT_PAGE')();
