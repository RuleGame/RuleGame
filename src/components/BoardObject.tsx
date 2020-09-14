import React, { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { Box, Stack, Text } from 'grommet';
import { Close } from 'grommet-icons';
import { FiCheck } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { VALID_SHAPES } from '../@types';
import ShapeObject from './ShapeObject';
import { cyBoardObject } from '../constants/data-cy-builders';
import { BoardObject as BoardObjectType } from '../utils/api';
import { Color } from '../constants/Color';
import { Shape } from '../constants/Shape';
import { showGridMemoryOrderSelector } from '../store/selectors/board';
import { DEBUG_ENABLED } from '../constants/env';

export type BoardObjectProps = {
  className?: string;
  boardObject: BoardObjectType;
  shape: Shape;
  color: Color;
  moveNum?: number;
};

const StyledShapeObject = styled(ShapeObject)<{ canDrag: boolean }>`
  width: 100%;
  height: 100%;
  cursor: ${({ canDrag }) => (canDrag ? 'grab' : 'unset')};
`;

const BoardObject = ({
  className,
  boardObject,
  shape,
  color,
  moveNum,
}: BoardObjectProps): JSX.Element => {
  const hasBeenDropped = boardObject.dropped !== undefined;

  const canDrag = boardObject.buckets.length > 0;
  const [, ref] = useDrag({
    item: {
      ...boardObject,
      type: 'object',
    },
    canDrag,
  });
  const showGridMemoryOrder = useSelector(showGridMemoryOrderSelector);
  const debugInfo = useMemo(
    () =>
      `${Object.entries({
        id: boardObject.id,
        color: boardObject.color,
        shape: boardObject.shape,
        x: boardObject.x,
        y: boardObject.y,
      }).reduce(
        (acc2, [key, value]) => `${acc2}${key}: ${value}\n`,
        '',
      )}buckets: [${boardObject.buckets.join(',')}]\n`,
    [boardObject],
  );

  return (
    <Stack
      className={className}
      data-cy={cyBoardObject(boardObject.id)}
      data-cy-checked={hasBeenDropped}
    >
      <StyledShapeObject
        shape={shape}
        color={color}
        ref={ref}
        canDrag={canDrag}
        shapeObjectId={boardObject.id}
        debugInfo={DEBUG_ENABLED ? debugInfo : undefined}
      />
      {hasBeenDropped && <FiCheck color="green" size="100%" />}
      {!hasBeenDropped && !canDrag && VALID_SHAPES.has(shape) && (
        <Close size="100%" color="black" />
      )}
      {showGridMemoryOrder && moveNum !== undefined && (
        <Box
          background="white"
          border={{ side: 'all', style: 'solid', color: 'black', size: 'small' }}
          round
          width="min-content"
          pad="xxsmall"
        >
          <Text weight="bold">{moveNum}</Text>
        </Box>
      )}
    </Stack>
  );
};

export default BoardObject;
