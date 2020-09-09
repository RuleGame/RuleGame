import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { BucketType } from '../@types';
import ShapeObject from './ShapeObject';
import { RootAction } from '../store/actions';
import { BoardObject } from '../utils/api';
import { isPausedSelector } from '../store/selectors/board';
import { Shape } from '../constants/Shape';
import { move } from '../store/actions/board';

export type BucketProps = {
  className?: string;
  shape: Shape;
  bucket: BucketType;
};

const StyledBucket = styled(ShapeObject)<{ isOver: boolean }>`
  filter: grayscale(${(props) => (props.isOver ? 0.5 : 0)});
`;

const Bucket = ({ className, shape, bucket }: BucketProps): JSX.Element => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const isPaused = useSelector(isPausedSelector);

  const [{ isOver }, ref] = useDrop({
    canDrop: () => !isPaused,
    drop: (droppedItem: BoardObject & { type: 'object' }) =>
      dispatch(move(droppedItem.id, bucket.pos)),
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
      opacity={isPaused && shape === Shape.BUCKET ? 0.5 : 1}
    />
  );
};

export default Bucket;
