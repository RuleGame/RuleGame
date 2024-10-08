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

export enum SearchQueryKey {
  WORKER_ID = 'workerId',
  EXPERIMENT_PLAN = 'exp',
  FULLSCREEN = 'fullscreen',
  HELP = 'help',
  VERSION = 'version',
  INTRO = 'intro',
  SERVER = 'server',
  UID = 'uid',
  // Three params that may occur in Prolific URLs, 2024-09
  PROLIFIC_PID = 'PROLIFIC_PID',
  STUDY_ID = 'STUDY_ID',
  SESSION_ID = 'SESSION_ID',
}

export const API_HOST_ORIGIN =
  new URLSearchParams(window.location.search).get(SearchQueryKey.SERVER) ??
  process.env.REACT_APP_APP_API_HOST_ORIGIN;

export const IMAGE_BASE_URL = `${API_HOST_ORIGIN}/GetImageServlet`;
export const BOOKLET_PAGE_BASE_URL = `${API_HOST_ORIGIN}/GetBookletPageServlet`;

export const VERSION = process.env.REACT_APP_VERSION;

export const boardPositionToBxBy: {
  [boardPosition in BucketPosition]: { bx: number; by: number };
} = {
  0: { bx: 0, by: rows - 1 },
  1: { bx: cols - 1, by: rows - 1 },
  2: { bx: cols - 1, by: 0 },
  3: { bx: 0, by: 0 },
};

export const HAS_UID = new URLSearchParams(window.location.search).get(SearchQueryKey.UID) !== null;

export const PAGE_ORDER: Page[] = [
  Page.CONSENT,
  Page.INTRODUCTION,
  Page.LOADING_TRIALS,
  Page.TRIALS,
  ...(!HAS_UID ? [Page.DEMOGRAPHICS_INSTRUCTIONS, Page.DEMOGRAPHICS] : []),
  Page.DEBRIEFING,
];

export const DEFAULT_WORKER_ID = 'testWorkerId';

export enum LOCAL_STORAGE_KEY {
  GUESS = 'GUESS',
  SERIES_NO = 'SERIES_NO',
  WORKER_ID = 'WORKER_ID',
}
export enum SpecialShape {
  HAPPY = 'happy',
  UNHAPPY = 'unhappy',
  BUCKET = 'bucket',
}
