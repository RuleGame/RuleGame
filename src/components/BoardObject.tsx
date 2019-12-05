import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { BoardObjectItem, Shape } from '../@types';
import ShapeObject from './ShapeObject';

export type BoardObjectProps = {
  className?: string;
  item: BoardObjectItem;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  shape: Shape;
  canDrag?: boolean;
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
}: BoardObjectProps): JSX.Element => {
  const canDrag = canDragProp && item.buckets !== undefined && item.buckets.size > 0;
  const [, ref] = useDrag({
    item,
    canDrag,
  });
  return (
    <StyledShapeObject
      shape={shape}
      className={className}
      onClick={onClick}
      ref={ref}
      canDrag={canDrag}
      shapeObjectId={item.id}
    />
  );
};

export default BoardObject;
