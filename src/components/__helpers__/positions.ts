import { BoardObjectsMapper } from '../../@types';

export const setPositions = (positions: { x: number; y: number }[]): BoardObjectsMapper => (
  boardObject,
  i,
) => ({
  ...boardObject,
  x: positions[i].x,
  y: positions[i].y,
});
