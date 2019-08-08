export type BoardObjectId = number;

export type BucketPosition = 'TL' | 'TR' | 'BL' | 'BR';

export type BoardObjectItem = { buckets: Set<BucketPosition>; id: BoardObjectId; type: 'object' };

export type Shape =
  | 'nothing'
  | 'bucket'
  | 'square'
  | 'triangle'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'happy'
  | 'check';

export type MinimalBoardObjectType = {
  id: BoardObjectId; // -1 denotes an undefined value
  color: string;
  shape: Shape;
  x: number;
  y: number;
};

export type BoardObjectType = {
  buckets: Set<BucketPosition>;
  draggable: boolean;
} & MinimalBoardObjectType;

export type BucketType = { pos: BucketPosition; x: number; y: number; id: number };

export type DropAttempt = { dragged: BoardObjectId; dropped: BucketPosition };

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

export type Game = 'game1' | 'game2';
