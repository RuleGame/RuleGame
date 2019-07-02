import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { BoardObjectItem } from '../@types';
import logo from '../logo.svg';
import ShapeObject from './ShapeObject';

export type BucketProps = {
  className?: string;
  onDrop: (item: BoardObjectItem) => undefined;
  canDrop: (item: BoardObjectItem) => boolean;
  dropped: boolean;
};

const StyledBucket = styled(ShapeObject)<{ isOver: boolean }>`
  filter: grayscale(${(props) => (props.isOver ? 0.5 : 0)});
`;

const Bucket = ({ className, onDrop, canDrop, dropped }: BucketProps): JSX.Element => {
  const [{ isOver }, ref] = useDrop({
    canDrop,
    drop: onDrop,
    accept: 'object',
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  // @ts-ignore
  return <StyledBucket ref={ref} src={logo} className={className} isOver={isOver} shape={dropped ? 'happy': 'bucket'} />;
};

export default Bucket;
