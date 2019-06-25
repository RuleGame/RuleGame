import React from 'react';
import { useDrop } from 'react-dnd';
import logo from '../logo.svg';
import { Item } from '../@types';

export type BucketProps = {
  className?: string;
  onDrop: (item: Item) => undefined;
  canDrop: (item: Item) => boolean;
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
