import React from 'react';
import { useDrop } from 'react-dnd';
import logo from '../logo.svg';
import { BoardObjectItem } from '../@types';

export type BucketProps = {
  className?: string;
  onDrop: (item: BoardObjectItem) => undefined;
  canDrop: (item: BoardObjectItem) => boolean;
};

const Bucket = ({ className, onDrop, canDrop }: BucketProps): JSX.Element => {
  const [, ref] = useDrop({
    canDrop,
    drop: onDrop,
    accept: 'object',
  });
  // @ts-ignore
  return <div ref={ref} src={logo} className={className} />;
};

export default Bucket;
