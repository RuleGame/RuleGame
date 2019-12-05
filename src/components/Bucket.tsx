import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { BoardObjectItem, BucketType, Shape } from '../@types';
import ShapeObject from './ShapeObject';

export type BucketProps = {
  className?: string;
  onDrop: (item: BoardObjectItem) => void;
  canDrop: (item: BoardObjectItem) => boolean;
  dropped: boolean;
  bucket: BucketType;
};

const StyledBucket = styled(ShapeObject)<{ isOver: boolean }>`
  filter: grayscale(${(props) => (props.isOver ? 0.5 : 0)});
`;

const Bucket = ({ className, onDrop, canDrop, dropped, bucket }: BucketProps): JSX.Element => {
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
      shape={dropped ? Shape.HAPPY : Shape.BUCKET}
      shapeObjectId={bucket.id}
    />
  );
};

export default Bucket;
