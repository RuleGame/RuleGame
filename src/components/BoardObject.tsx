import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { BoardObjectItem, Shape } from '../@types';
import logo from '../logo.svg';
import ShapeObject from './ShapeObject';

export type BoardObjectProps = {
  className?: string;
  item: BoardObjectItem;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  shape: Shape;
};

const StyledShapeObject = styled(ShapeObject)<{ canDrag: boolean; mouseDown: boolean }>`
  width: 100%;
  height: 100%;
  cursor: grab;
`;

const BoardObject = ({ className, item, onClick, shape }: BoardObjectProps): JSX.Element => {
  const canDrag = item.buckets.size > 0;
  const [, ref] = useDrag({
    item,
    canDrag,
  });
  return (
    // @ts-ignore
    <StyledShapeObject
      shape={shape}
      src={logo}
      className={className}
      onClick={onClick}
      ref={ref}
      canDrag={canDrag}
    />
  );
};

export default BoardObject;
