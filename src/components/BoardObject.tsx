import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { BoardObjectItem } from '../@types';
import logo from '../logo.svg';
import ShapeObject from './ShapeObject';

export type BoardObjectProps = {
  className?: string;
  item: BoardObjectItem;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const StyledShapeObject = styled(ShapeObject)<{ canDrag: boolean }>`
  width: 100%;
  height: 100%;

  &:active {
    cursor: ${({ canDrag }) => (canDrag ? 'not-allowed' : 'unset')};
  }
`;

const BoardObject = ({ className, item, onClick }: BoardObjectProps): JSX.Element => {
  const canDrag = item.buckets.size > 0;
  const [, ref] = useDrag({
    item,
    canDrag,
  });
  return (
    // @ts-ignore
    <StyledShapeObject
      {...item}
      src={logo}
      className={className}
      onClick={onClick}
      ref={ref}
      canDrag={canDrag}
    />
  );
};

export default BoardObject;
