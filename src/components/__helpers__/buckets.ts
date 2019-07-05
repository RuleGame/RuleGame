import { BucketPosition, BucketPositionsMapper } from '../../@types';
import { cols, rows } from '../../constants';

export const setAllBucketsMapper = (buckets: BucketPosition[]): BucketPositionsMapper => (
  boardObject,
) => ({
  ...boardObject,
  buckets: new Set<BucketPosition>(buckets),
});

export const closestBucketsMapper: BucketPositionsMapper = (boardObject) => ({
  ...boardObject,
  buckets: new Set<BucketPosition>([
    ...(boardObject.x <= cols / 2 && boardObject.y <= rows / 2 ? ['BL' as BucketPosition] : []),
    ...(boardObject.x >= cols / 2 && boardObject.y <= rows / 2 ? ['BR' as BucketPosition] : []),
    ...(boardObject.x >= cols / 2 && boardObject.y >= rows / 2 ? ['TR' as BucketPosition] : []),
    ...(boardObject.x <= cols / 2 && boardObject.y >= rows / 2 ? ['TL' as BucketPosition] : []),
  ]),
});
