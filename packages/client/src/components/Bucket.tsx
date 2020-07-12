import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { BoardObjectItem, BucketType, Shape } from '../@types';
import ShapeObject from './ShapeObject';
import { gamePausedSelector } from '../store/selectors/rule-row';

export type BucketProps = {
  className?: string;
  onDrop: (item: BoardObjectItem) => void;
  canDrop: (item: BoardObjectItem) => boolean;
  shape: Shape;
  bucket: BucketType;
};

const StyledBucket = styled(ShapeObject)<{ isOver: boolean }>`
  filter: grayscale(${(props) => (props.isOver ? 0.5 : 0)});
`;

const Bucket = ({ className, onDrop, canDrop, shape, bucket }: BucketProps): JSX.Element => {
  const gamePaused = useSelector(gamePausedSelector);

  const [{ isOver }, ref] = useDrop({
    canDrop,
    drop: onDrop,
    accept: 'object',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <StyledBucket
      ref={ref}
      className={className}
      isOver={isOver}
      shape={shape}
      shapeObjectId={bucket.id}
      opacity={gamePaused && shape === Shape.BUCKET ? 0.5 : 1}
    />
  );
};

export default Bucket;
