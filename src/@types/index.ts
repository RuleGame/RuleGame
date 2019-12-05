export type BoardObjectId = string;

export enum BucketPosition {
  TL = 0,
  TR = 1,
  BL = 2,
  BR = 3,
}

export type BoardObjectItem = { buckets: Set<BucketPosition>; id: BoardObjectId; type: 'object' };

export type BoardObjectType = {
  id: string; // -1 denotes an undefined value
  color: Color;
  shape: Shape;
  x: number;
  y: number;
};

// export type BoardObjectType = {
//   buckets: BucketPosition[]; // DressedDisplay
//   draggable: boolean;
// } & MinimalBoardObjectType;

export type BucketType = { pos: BucketPosition; x: number; y: number; id: string };

export type DropAttempt = { dragged: string; dropped: BucketPosition };

export type Log = {
  id: number;
  data: {
    boardId: number;
    moveNum: number;
    touchAttempts: BoardObjectId[];
    dropAttempts: DropAttempt[];
    dropSuccess: DropAttempt;
  };
};

export type Rule = 'nearest' | 'clockwise';

export type BoardObjectsMapper = (boardObject: BoardObjectType, index: number) => BoardObjectType;

export type Page = 'RuleGame' | 'Entrance';

export enum Game {
  GAME1,
  GAME2,
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
