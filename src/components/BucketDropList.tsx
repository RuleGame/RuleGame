import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Stack, Text } from 'grommet';
import styled from 'styled-components';
import ShapeObject from './ShapeObject';
import { BucketPosition } from '../constants/BucketPosition';
import {
  bucketDropListSelector,
  moveNumByBoardObjectSelector,
  showStackMemoryOrderSelector,
} from '../store/selectors/board';
import ImageShapeObject from './ImageShapeObject';

const BoardObjectSquare = styled.div<{}>`
  width: 100%;
  height: 100%;
  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

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
      width="100%"
      height="90%"
      pad="xxsmall"
      round={{ corner: 'bottom' }}
      border={[{ side: 'bottom' }, { side: 'left' }, { side: 'right' }]}
      overflow={{ vertical: 'auto' }}
    >
      {bucketDropList.map((boardObject) => (
        <Stack key={boardObject.id} anchor="top-left">
          <Box fill="horizontal" height="min-content" width="medium">
            {boardObject.image !== undefined ? (
              <BoardObjectSquare>
                <Box style={{ position: 'absolute' }} fill pad="xxsmall">
                  <ImageShapeObject image={boardObject.image} />
                </Box>
              </BoardObjectSquare>
            ) : (
              <ShapeObject shape={boardObject.shape} color={boardObject.color} />
            )}
          </Box>
          {showStackMemoryOrder && boardObject.id in moveNumByBoardObject && (
            <Box
              background="white"
              border={{ side: 'all', style: 'solid', color: 'black', size: 'small' }}
              round
              width="min-content"
              pad={{ left: 'xxsmall', right: 'xxsmall' }}
            >
              <Text size="xsmall" weight="bold">
                {moveNumByBoardObject[boardObject.id]}
              </Text>
            </Box>
          )}
        </Stack>
      ))}
    </Box>
  );
};

export default BucketDropList;
