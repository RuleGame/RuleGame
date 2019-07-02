import { BucketType, MinimalBoardObjectType } from '../@types';

export const afterDragTimeout = 1000; // In miliseconds.

export const rows = 8;
export const cols = 8;

export const initialBoardObjects: MinimalBoardObjectType[] = [
  {
    id: 0,
    shape: 'square',
    color: 'blue',
    x: 2,
    y: 2,
  },
  {
    id: 1,
    shape: 'triangle',
    color: 'black',
    x: 5,
    y: 2,
  },
  {
    id: 2,
    shape: 'circle',
    color: 'red',
    x: 5,
    y: 4,
  },
  {
    id: 3,
    shape: 'triangle',
    color: 'yellow',
    x: 2,
    y: 6,
  },
  {
    id: 4,
    shape: 'star',
    color: 'blue',
    x: 5,
    y: 6,
  },
];

export const bucketCoords: BucketType[] = [
  { pos: 'BL', x: 0, y: 0 },
  { pos: 'TL', x: 0, y: rows - 1 },
  { pos: 'BR', x: cols - 1, y: 0 },
  { pos: 'TR', x: cols - 1, y: rows - 1 },
];
