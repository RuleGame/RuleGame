export type BucketPosition = 'TL' | 'TR' | 'BL' | 'BR';

export type Item = { buckets: Set<BucketPosition>; id: number; type: 'object' };

export type Shape = 'square' | 'triangle' | 'circle' | 'triangle' | 'star' | 'happy';

export type BoardObjectType = {
  id: number; // -1 denotes an undefined value
  color: string;
  shape: Shape;
  x: number;
  y: number;
  buckets: Set<BucketPosition>;
};

export type BucketType = { pos: BucketPosition; x: number; y: number };
