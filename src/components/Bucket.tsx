import React from 'react';
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

const InvalidDropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  background-color: rgba(253, 253, 253, 0.2);
  z-index: 9999; /* Increase z-index for testing */
`;

const Bucket = ({ className, shape, bucket }: BucketProps): JSX.Element => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const isPaused = useSelector(isPausedSelector);
  const isGameCompleted = useSelector(isGameCompletedSelector);
  const disallowedBuckets = useSelector(disallowedBucketSelector);

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
    item && disallowedBuckets[item.id] && disallowedBuckets[item.id].includes(bucket.pos);

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
