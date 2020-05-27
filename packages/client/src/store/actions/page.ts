import { createAction } from 'typesafe-actions';
// eslint-disable-next-line import/no-cycle
import { Page } from '../../@types';

export const goToPage = createAction('page/GO_TO_PAGE', (page: Page) => ({ page }))();
