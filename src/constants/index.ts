import { BucketType, BucketPosition, Rule, Game, Color, Shape } from '../@types';

export const afterDragTimeout = 1000; // In miliseconds.

export const rows = 8;
export const cols = 8;

export const bucketOrder: BucketPosition[] = ['TL', 'TR', 'BR', 'BL'];

export const buckets: BucketType[] = [
  { pos: 'BL', x: 0, y: 0, id: 0 },
  { pos: 'TL', x: 0, y: rows - 1, id: 1 },
  { pos: 'BR', x: cols - 1, y: 0, id: 2 },
  { pos: 'TR', x: cols - 1, y: rows - 1, id: 3 },
];

// Types are not abstracted because they are not used elsewhere.
export const gameToRule: { [game in Game]: Rule } = {
  game1: 'nearest',
  game2: 'clockwise',
};
export const colors: Color[] = [Color.RED, Color.BLUE, Color.BLACK, Color.YELLOW];

export const shapes: Shape[] = [Shape.SQUARE, Shape.TRIANGLE, Shape.STAR, Shape.CIRCLE];

export const borderWidth = 1;
export const borderHeight = 1;
