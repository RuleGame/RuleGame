// eslint-disable-next-line import/no-cycle
import { RootAction } from '../store/actions';

export type BoardObjectId = string;

export enum BucketPosition {
  TL = 0,
  TR = 1,
  BR = 2,
  BL = 3,
}

export type BoardObjectItem = {
  debugInfo?: string;
  buckets: Set<BucketPosition>;
  id: BoardObjectId;
  type: 'object';
};

export type BoardObjectType = {
  id: string; // -1 denotes an undefined value
  color: Color;
  shape: Shape;
  x: number;
  y: number;
};

export type BucketType = { pos: BucketPosition; x: number; y: number; id: string };

export type DropAttempt = { dragged: string; dropped: BucketPosition };

export type Page = 'RuleGame' | 'Entrance';

export enum Game {
  GAME1,
}

export enum Color {
  ANY = '*',
  RED = 'red',
  BLUE = 'blue',
  BLACK = 'black',
  YELLOW = 'yellow',
  GREEN = 'green',
}

export enum Shape {
  ANY = '*',
  SQUARE = 'square',
  TRIANGLE = 'triangle',
  STAR = 'star',
  CIRCLE = 'circle',
  NOTHING = 'nothing',
  BUCKET = 'bucket',
  HAPPY = 'happy',
  CHECK = 'check',
}

export type AtomFn = (
  boardObjectId: BoardObjectId,
  totalMoveHistory: DropAttempt[],
  boardObjects: { [id: string]: BoardObjectType },
) => BucketPosition;

export type Atom = {
  id: string;
  counter: number;
  shape: Shape;
  color: Color;
  position: number;
  fns: AtomFn[];
};

export type ActionButton = {
  key: string;
  label: string;
  action: RootAction;
};
