export type BoardObjectId = number;

export type BucketPosition = 'TL' | 'TR' | 'BL' | 'BR';

export type BoardObjectItem = { buckets: Set<BucketPosition>; id: BoardObjectId; type: 'object' };

export type Shape = 'square' | 'triangle' | 'circle' | 'triangle' | 'star' | 'happy';

export type BoardObjectType = {
  id: BoardObjectId; // -1 denotes an undefined value
  color: string;
  shape: Shape;
  x: number;
  y: number;
  buckets: Set<BucketPosition>;
};

export type BucketType = { pos: BucketPosition; x: number; y: number };

export type DropAttempt = { dragged: BoardObjectId; dropped: BucketPosition };

export type Log = {
  touchedObjects: BoardObjectId[];
  dropAttempts: DropAttempt[];
};
