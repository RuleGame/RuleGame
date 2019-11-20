import { BoardObjectsMapper, BucketPosition } from '../../@types';
import { cols, rows } from '../../constants';

export const setAllBucketsTo = (buckets: BucketPosition[]): BoardObjectsMapper => (
  boardObject,
) => ({
  ...boardObject,
  buckets: new Set(buckets),
});

export const nearestBucket: BoardObjectsMapper = (boardObject) => ({
  ...boardObject,
  buckets: new Set([
    ...(boardObject.x <= (cols - 1) / 2 && boardObject.y <= (rows - 1) / 2
      ? [BucketPosition.BL]
      : []),
    ...(boardObject.x >= (cols - 1) / 2 && boardObject.y <= (rows - 1) / 2
      ? [BucketPosition.BR]
      : []),
    ...(boardObject.x >= (cols - 1) / 2 && boardObject.y >= (rows - 1) / 2
      ? [BucketPosition.TR]
      : []),
    ...(boardObject.x <= (cols - 1) / 2 && boardObject.y >= (rows - 1) / 2
      ? [BucketPosition.TL]
      : []),
  ]),
});

export const blueSquareAnyBucket: BoardObjectsMapper = (boardObject) => ({
  ...boardObject,
  buckets: new Set(
    boardObject.color === 'blue' && boardObject.shape === 'square'
      ? [BucketPosition.TL, BucketPosition.TR, BucketPosition.BL, BucketPosition.BR]
      : [],
  ),
});
