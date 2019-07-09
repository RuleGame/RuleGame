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
    ...(boardObject.x <= cols / 2 && boardObject.y <= rows / 2 ? ['BL' as BucketPosition] : []),
    ...(boardObject.x >= cols / 2 && boardObject.y <= rows / 2 ? ['BR' as BucketPosition] : []),
    ...(boardObject.x >= cols / 2 && boardObject.y >= rows / 2 ? ['TR' as BucketPosition] : []),
    ...(boardObject.x <= cols / 2 && boardObject.y >= rows / 2 ? ['TL' as BucketPosition] : []),
  ]),
});

export const initialBucketsMapper: BoardObjectsMapper = (boardObject) => ({
  ...boardObject,
  buckets: new Set(
    boardObject.color === 'blue' ? (['TL', 'TR', 'BL', 'BR'] as BucketPosition[]) : [],
  ),
});
