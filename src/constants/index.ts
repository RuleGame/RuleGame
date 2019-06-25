import { BoardObjectType, BucketPosition, BucketType } from '../@types';

export const rows = 8;
export const cols = 8;

export const boardObjects: BoardObjectType[] = [
  {
    shape: 'square',
    color: 'blue',
    x: 2,
    y: 2,
    buckets: new Set([BucketPosition.TL, BucketPosition.BL]),
  },
  {
    shape: 'triangle',
    color: 'black',
    x: 5,
    y: 2,
    buckets: new Set([]),
  },
  {
    shape: 'circle',
    color: 'red',
    x: 5,
    y: 4,
    buckets: new Set([]),
  },
  {
    shape: 'triangle',
    color: 'yellow',
    x: 2,
    y: 6,
    buckets: new Set([]),
  },
  {
    shape: 'star',
    color: 'blue',
    x: 5,
    y: 6,
    buckets: new Set([BucketPosition.TL, BucketPosition.BL]),
  },
];

export const bucketCoords: BucketType[] = [
  { pos: BucketPosition.TL, x: 0, y: 0 },
  { pos: BucketPosition.BL, x: 0, y: rows - 1 },
  { pos: BucketPosition.BR, x: cols - 1, y: 0 },
  { pos: BucketPosition.TR, x: cols - 1, y: rows - 1 },
];
