import { boardObjectsMapper, BucketPosition } from '../../@types';
import { cols, rows } from '../../constants';

export const setAllBucketsMapperCreator = (buckets: BucketPosition[]): boardObjectsMapper => (
  boardObject,
) => ({
  ...boardObject,
  buckets: new Set<BucketPosition>(buckets),
});

export const closestBucketsMapper: boardObjectsMapper = (boardObject) => ({
  ...boardObject,
  buckets: new Set<BucketPosition>([
    ...(boardObject.x <= cols / 2 && boardObject.y <= rows / 2 ? ['BL' as BucketPosition] : []),
    ...(boardObject.x >= cols / 2 && boardObject.y <= rows / 2 ? ['BR' as BucketPosition] : []),
    ...(boardObject.x >= cols / 2 && boardObject.y >= rows / 2 ? ['TR' as BucketPosition] : []),
    ...(boardObject.x <= cols / 2 && boardObject.y >= rows / 2 ? ['TL' as BucketPosition] : []),
  ]),
});

export const checkObjectMapperCreator = (droppedBoardObjectId: number): boardObjectsMapper => (
  boardObject,
) => ({
  ...boardObject,
  ...(boardObject.id === droppedBoardObjectId
    ? {
        shape: 'check',
        draggable: false,
      }
    : {}),
});
