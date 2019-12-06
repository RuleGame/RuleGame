import { Game, Shape } from '../@types';

export const shapeObjectCy = <T extends string = Shape>(id: string, shape: T) =>
  `shape-object-${id}-${shape}`;

export const entranceButtonCy = (game: Game) => `game-${game}`;
