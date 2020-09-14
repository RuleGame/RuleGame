import { rows, cols } from '../constants';
import { Atom, BoardObjectType } from '../@types';
import { Color } from '../constants/Color';
import { Shape } from '../constants/Shape';

export const xYToPosition = (x: number, y: number) => (y - 1) * (rows - 2) + x;

export const positionToXy = (position: number) => ({
  x: ((position - 1) % (rows - 2)) + 1,
  y: Math.floor((position - 1) / (cols - 2)) + 1,
});

/**
 * Check for match excluding the atom's functions. Intended to use for the filter function inside
 * the rule-row reducer.
 */
export default (boardObject: BoardObjectType, atomCounts: { [atomId: string]: number }) => (
  atom: Atom,
) =>
  atomCounts[atom.id] > 0 &&
  (atom.color === Color.ANY || atom.color === boardObject.color) &&
  (atom.shape === Shape.ANY || atom.shape === boardObject.shape);
