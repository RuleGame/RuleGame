import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Text } from 'grommet';
import { BucketPosition } from '../@types';
import { bucketDropListSelector, moveNumByBoardObjectSelector } from '../store/selectors/rule-row';
import ShapeObject from './ShapeObject';
import { showStackMemoryOrderSelector } from '../store/selectors/game';

const BucketDropList: React.FunctionComponent<{
  bucket: BucketPosition;
}> = ({ bucket }) => {
  const bucketDropList = useSelector(bucketDropListSelector(bucket));
  const moveNumByBoardObject = useSelector(moveNumByBoardObjectSelector);
  const showStackMemoryOrder = useSelector(showStackMemoryOrderSelector);

  return (
    <Box
      direction="column-reverse"
      justify="start"
      width="50%"
      height="90%"
      border={[{ side: 'bottom' }, { side: 'left' }, { side: 'right' }]}
    >
      {bucketDropList.map((boardObject) => (
        <Box direction="row" key={boardObject.id}>
          <Box fill="horizontal" height="min-content">
            <ShapeObject shape={boardObject.shape} color={boardObject.color} />
          </Box>
          {showStackMemoryOrder && boardObject.id in moveNumByBoardObject && (
            <Text>{moveNumByBoardObject[boardObject.id]}</Text>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default BucketDropList;
