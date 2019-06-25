import { DragObjectWithType } from 'react-dnd';

export enum BucketPosition {
  TL,
  TR,
  BL,
  BR,
}
export type Item = { buckets: Set<BucketPosition> } & DragObjectWithType;

export type BoardObjectType = {
  color: string;
  shape: 'square' | 'triangle' | 'circle' | 'triangle' | 'star';
  x: number;
  y: number;
  buckets: Set<BucketPosition>;
};

export type BucketType = { pos: BucketPosition; x: number; y: number };
