import { Shape } from '../@types';

export const shapeObjectCy = <T extends string = Shape>(id: string, shape: T) =>
  `shape-object-${id}-${shape}`;
