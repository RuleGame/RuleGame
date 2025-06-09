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
  is2PGAdveGameSelector,
  is2PGCoopGameSelector,
  botAssistanceSelector,
} from '../store/selectors/board';
import { Shape } from '../constants/Shape';
import { move, setIsBotAssisted } from '../store/actions/board';
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
  isBotAssisted?: string;
  shapeObjectId: string;
  is2PG?: boolean;
}>`
  filter: grayscale(${(props) => (props.isOver ? 0.5 : 0)});
  transform: scale(${(props) => (props.isOver ? 2 : 1)});
  position: relative;

  ${({ shapeObjectId, isBotAssisted, is2PG }) =>
    shapeObjectId && (isBotAssisted || is2PG)
      ? `
      &::before {
        content: '${shapeObjectId.slice(-1)}';
        position: absolute;
        top: 2px;
        left: 2px;
        background: white;
        color: black;
        font-weight: bold;
        font-size: 12px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #333;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        pointer-events: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    `
      : ''}
`;

const Bucket = ({ className, shape, bucket }: BucketProps): JSX.Element => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const isPaused = useSelector(isPausedSelector);
  const isGameCompleted = useSelector(isGameCompletedSelector);
  const disallowedBuckets = useSelector(disallowedBucketSelector);
  const hoveredItem = useSelector(hoveredItemSelector);
  const is2PG = useSelector(is2PGAdveGameSelector) || useSelector(is2PGCoopGameSelector);
  const isBotAssisted = useSelector(botAssistanceSelector);

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
    disallowedBuckets[hoveredItem.id].includes(bucket.pos) &&
    is2PG;

  return (
    <StyledBucket
      ref={ref}
      className={className}
      isOver={isOver}
      shape={shape}
      shapeObjectId={bucket.id}
      isBotAssisted={isBotAssisted}
      is2PG={is2PG}
      showInvalidDropX={showInvalidDropX}
      opacity={(isGameCompleted || isPaused) && shape === SpecialShape.BUCKET ? 0.5 : 1}
    />
  );
};

export default Bucket;
