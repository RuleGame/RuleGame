import { BoardObjectsMapper, BucketPosition } from '../../@types';
import { cols, rows } from '../../constants';

export const setAllBucketsMapperCreator = (buckets: BucketPosition[]): BoardObjectsMapper => (
  boardObject,
) => ({
  ...boardObject,
  buckets: new Set(buckets),
});

export const closestBucketsMapper: BoardObjectsMapper = (boardObject) => ({
  ...boardObject,
  buckets: new Set([
    ...(boardObject.x <= cols / 2 && boardObject.y <= rows / 2 ? (['BL'] as const) : []),
    ...(boardObject.x >= cols / 2 && boardObject.y <= rows / 2 ? (['BR'] as const) : []),
    ...(boardObject.x >= cols / 2 && boardObject.y >= rows / 2 ? (['TR'] as const) : []),
    ...(boardObject.x <= cols / 2 && boardObject.y >= rows / 2 ? (['TL'] as const) : []),
  ]),
});

export const firstMoveBucketsMapper: BoardObjectsMapper = (boardObject) => ({
  ...boardObject,
  buckets: new Set(
    boardObject.color === 'blue' && boardObject.shape === 'square'
      ? (['TL', 'TR', 'BL', 'BR'] as const)
      : [],
  ),
});
