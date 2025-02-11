import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Close } from 'grommet-icons';
import { BucketType } from '../@types';
import ShapeObject from './ShapeObject';
import { RootAction } from '../store/actions';
import { BoardObject } from '../utils/api';
import {
  isGameCompletedSelector,
  isPausedSelector,
  disallowedBucketSelector,
  hoveredItemSelector,
} from '../store/selectors/board';
import { Shape } from '../constants/Shape';
import { move } from '../store/actions/board';
import { SpecialShape } from '../constants';

export type BucketProps = {
  className?: string;
  shape: Shape;
  bucket: BucketType;
};

const StyledBucket = styled(ShapeObject)<{
  isOver: boolean;
  showInvalidDropX?: boolean;
  children?: React.ReactNode;
}>`
  filter: grayscale(${(props) => (props.isOver ? 0.5 : 0)});
  transform: scale(${(props) => (props.isOver ? 2 : 1)});
  position: relative;
`;

const Bucket = ({ className, shape, bucket }: BucketProps): JSX.Element => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const isPaused = useSelector(isPausedSelector);
  const isGameCompleted = useSelector(isGameCompletedSelector);
  const disallowedBuckets = useSelector(disallowedBucketSelector);
  const hoveredItem = useSelector(hoveredItemSelector);

  const [{ isOver, item }, ref] = useDrop({
    canDrop: () => !isPaused,
    drop: (droppedItem: BoardObject & { type: 'object' }) =>
      dispatch(move(droppedItem.id, bucket.pos)),
    accept: 'object',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      item: monitor.getItem(),
    }),
  });

  // Determine if an X should be shown
  const showInvalidDropX =
    hoveredItem &&
    disallowedBuckets[hoveredItem.id] &&
    disallowedBuckets[hoveredItem.id].includes(bucket.pos);

  return (
    <StyledBucket
      ref={ref}
      className={className}
      isOver={isOver}
      shape={shape}
      shapeObjectId={bucket.id}
      showInvalidDropX={showInvalidDropX}
      opacity={(isGameCompleted || isPaused) && shape === SpecialShape.BUCKET ? 0.5 : 1}
    />
  );
};

export default Bucket;
