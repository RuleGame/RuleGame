import React from 'react';
import { useDrag } from 'react-dnd';
import { FiCircle, FiSquare, FiStar, FiTriangle } from 'react-icons/fi';
import styled from 'styled-components';
import { BoardObjectItem, Shape } from '../@types';
import HappyFace from '../assets/smiley-face.png';
import logo from '../logo.svg';

export type BoardObjectProps = {
  className?: string;
  item: BoardObjectItem;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export type ShapeProps = {
  ref: React.Ref<HTMLDivElement>;
  shape: Shape;
} & BoardObjectProps;

const ShapeObject = React.forwardRef<HTMLDivElement, ShapeProps>(({ shape, ...props }, ref) => {
  switch (shape) {
    case 'star':
      return (
        <div {...props} ref={ref}>
          <FiStar size="100%" />
        </div>
      );
    case 'circle':
      return (
        <div {...props} ref={ref}>
          <FiCircle size="100%" />
        </div>
      );
    case 'square':
      return (
        <div {...props} ref={ref}>
          <FiSquare size="100%" />
        </div>
      );
    case 'triangle':
      return (
        <div {...props} ref={ref}>
          <FiTriangle size="100%" />
        </div>
      );
    case 'happy':
      return (
        <div {...props} ref={ref}>
          <img src={HappyFace} alt="happy-face" width="100%" height="100%" />
        </div>
      );
    default:
      return null;
  }
});

const StyledShapeObject = styled(ShapeObject)<{ canDrag: boolean }>`
  width: 100%;
  height: 100%;
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
