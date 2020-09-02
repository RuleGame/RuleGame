import { BucketPosition, BucketType, Color, Shape } from '../@types';

export const DEV = process.env.NODE_ENV !== 'production';

export const rows = 8;
export const cols = 8;

export const buckets: BucketType[] = [
  { pos: BucketPosition.BL, x: 0, y: 0, id: `bucket-${BucketPosition.BL}` },
  { pos: BucketPosition.TL, x: 0, y: rows - 1, id: `bucket-${BucketPosition.TL}` },
  { pos: BucketPosition.BR, x: cols - 1, y: 0, id: `bucket-${BucketPosition.BR}` },
  { pos: BucketPosition.TR, x: cols - 1, y: rows - 1, id: `bucket-${BucketPosition.TR}` },
];

export const colors: Color[] = [Color.RED, Color.BLUE, Color.BLACK, Color.YELLOW];

export const shapes: Shape[] = [Shape.SQUARE, Shape.TRIANGLE, Shape.STAR, Shape.CIRCLE];

export const borderWidth = 1;
export const borderHeight = 1;

export const FILE_VERSION = '0.0.0';

export const FEEDBACK_DURATION = window.Cypress ? 100 : 1000;

export const RULE_EMAIL_ADDRESS = 'w2020rulegame@gmail.com';

export const WORKER_ID_SEARCH_QUERY = 'workerId';

export enum QUERY_KEYS {
  TRIALS = 'TRIALS',
}
