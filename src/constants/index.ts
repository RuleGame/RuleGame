// eslint-disable-next-line import/no-cycle
import { BucketType } from '../@types';
import { BucketPosition } from './BucketPosition';
import { Page } from './Page';

export const DEV = process.env.NODE_ENV !== 'production';

export const rows = 8;
export const cols = 8;

export const buckets: BucketType[] = [
  { pos: BucketPosition.BL, x: 0, y: 0, id: `bucket-${BucketPosition.BL}` },
  { pos: BucketPosition.TL, x: 0, y: rows - 1, id: `bucket-${BucketPosition.TL}` },
  { pos: BucketPosition.BR, x: cols - 1, y: 0, id: `bucket-${BucketPosition.BR}` },
  { pos: BucketPosition.TR, x: cols - 1, y: rows - 1, id: `bucket-${BucketPosition.TR}` },
];

export const borderHeight = 1;
export const FEEDBACK_DURATION = window.Cypress ? 100 : 1000;

export enum SEARCH_QUERY_KEYS {
  WORKER_ID = 'workerId',
  EXPERIMENT_PLAN = 'exp',
  FULLSCREEN = 'fullscreen',
  HELP = 'help',
}
export const API_HOST_ORIGIN = process.env.REACT_APP_APP_API_HOST_ORIGIN;

export const boardPositionToBxBy: {
  [boardPosition in BucketPosition]: { bx: number; by: number };
} = {
  0: { bx: 0, by: rows - 1 },
  1: { bx: cols - 1, by: rows - 1 },
  2: { bx: cols - 1, by: 0 },
  3: { bx: 0, by: 0 },
};

export const PAGE_ORDER: Page[] = [
  Page.CONSENT,
  Page.INTRODUCTION,
  Page.LOADING_TRIALS,
  Page.TRIALS,
  Page.DEMOGRAPHICS_INSTRUCTIONS,
  Page.DEMOGRAPHICS,
  Page.DEBRIEFING,
];

export const DEFAULT_WORKER_ID = 'testWorkerId';

export enum LOCAL_STORAGE_KEY {
  GUESS = 'GUESS',
  SERIES_NO = 'SERIES_NO',
  WORKER_ID = 'WORKER_ID',
}

export const SHAPES_URL_PREFIX = `${API_HOST_ORIGIN}/admin/getSvg.jsp?shape=`;

export enum SpecialShape {
  HAPPY = 'happy',
  UNHAPPY = 'unhappy',
  BUCKET = 'bucket',
}
