import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { Stack } from 'grommet';
import { Close } from 'grommet-icons';
import { FiCheck } from 'react-icons/fi';
import { BoardObjectItem, Color, Shape, VALID_SHAPES } from '../@types';
import ShapeObject from './ShapeObject';
import { cyBoardObject } from '../constants/data-cy-builders';

export type BoardObjectProps = {
  className?: string;
  item: BoardObjectItem;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  shape: Shape;
  canDrag?: boolean;
  checked: boolean;
  color: Color;
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
}: BoardObjectProps): JSX.Element => {
  const canDrag = canDragProp && item.buckets !== undefined && item.buckets.size > 0;
  const [, ref] = useDrag({
    item,
    canDrag,
  });
  return (
    <Stack className={className} data-cy={cyBoardObject(item.id)} data-cy-checked={checked}>
      {checked && <FiCheck color="green" size="100%" />}
      {!checked && !canDrag && VALID_SHAPES.has(shape) && <Close size="100%" color="grey" />}
      <StyledShapeObject
        shape={shape}
        color={color}
        onClick={onClick}
        ref={ref}
        canDrag={canDrag}
        shapeObjectId={item.id}
        debugInfo={item.debugInfo}
        opacity={!canDrag && VALID_SHAPES.has(shape) ? 0.25 : 1}
      />
    </Stack>
  );
};

export default BoardObject;
