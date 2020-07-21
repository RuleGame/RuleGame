import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from 'grommet';
import { BucketPosition } from '../@types';
import { bucketDropListSelector } from '../store/selectors/rule-row';
import ShapeObject from './ShapeObject';

const BucketDropList: React.FunctionComponent<{
  bucket: BucketPosition;
}> = ({ bucket }) => {
  const bucketDropList = useSelector(bucketDropListSelector(bucket));
  return (
    <Box
      direction="column-reverse"
      justify="start"
      width="50%"
      height="90%"
      border={[{ side: 'bottom' }, { side: 'left' }, { side: 'right' }]}
    >
      {bucketDropList.map((boardObject) => (
        <Box fill="horizontal" height="min-content" key={boardObject.id}>
          <ShapeObject shape={boardObject.shape} color={boardObject.color} />
        </Box>
      ))}
    </Box>
  );
};

export default BucketDropList;
