import { rows } from '../constants';
import { Atom, BoardObjectType, Color, Shape } from '../@types';

export const xYToPosition = (x: number, y: number) => (y - 1) * (rows - 2) + x;

/**
 * Check for match excluding the atom's functions. Intended to use for the filter function inside
 * the rule-row reducer.
 */
export default (boardObject: BoardObjectType, atomCounts: { [atomId: string]: number }) => (
  atom: Atom,
) =>
  atomCounts[atom.id] > 0 &&
  (atom.color === Color.ANY || atom.color === boardObject.color) &&
  (atom.shape === Shape.ANY || atom.shape === boardObject.shape) &&
  (Number.isNaN(atom.position) || xYToPosition(boardObject.x, boardObject.y) === atom.position);
