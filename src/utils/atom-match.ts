import { cols, rows } from '../constants';

export const xYToPosition = (x: number, y: number) => (y - 1) * (rows - 2) + x;

export const positionToXy = (position: number) => ({
  x: ((position - 1) % (rows - 2)) + 1,
  y: Math.floor((position - 1) / (cols - 2)) + 1,
});
