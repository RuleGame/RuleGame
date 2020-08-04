import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { Box, Stack, Text } from 'grommet';
import { Close } from 'grommet-icons';
import { FiCheck } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { BoardObjectItem, Color, Shape, VALID_SHAPES } from '../@types';
import ShapeObject from './ShapeObject';
import { cyBoardObject } from '../constants/data-cy-builders';
import { showGridMemoryOrderSelector } from '../store/selectors/game';

export type BoardObjectProps = {
  className?: string;
  item: BoardObjectItem;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  shape: Shape;
  canDrag?: boolean;
  checked: boolean;
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
  item,
  onClick,
  shape,
  canDrag: canDragProp = true,
  checked,
  color,
  moveNum,
}: BoardObjectProps): JSX.Element => {
  const canDrag = canDragProp && item.buckets !== undefined && item.buckets.size > 0;
  const [, ref] = useDrag({
    item,
    canDrag,
  });
  const showGridMemoryOrder = useSelector(showGridMemoryOrderSelector);

  return (
    <Stack className={className} data-cy={cyBoardObject(item.id)} data-cy-checked={checked}>
      <StyledShapeObject
        shape={shape}
        color={color}
        onClick={onClick}
        ref={ref}
        canDrag={canDrag}
        shapeObjectId={item.id}
        debugInfo={item.debugInfo}
      />
      {checked && <FiCheck color="green" size="100%" />}
      {!checked && !canDrag && VALID_SHAPES.has(shape) && <Close size="100%" color="black" />}
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
