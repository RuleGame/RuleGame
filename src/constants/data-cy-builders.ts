import { Shape } from '../@types';

export const shapeObjectCy = <T extends string = Shape>(id: number, shape: T) =>
  `shape-object-${id}-${shape}`;
