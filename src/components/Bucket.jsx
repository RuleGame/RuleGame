import React from 'react';
import { useDrop } from 'react-dnd';
import logo from '../logo.svg';

type Props = {
  className?: string,
};

const Bucket = ({ className }: Props) => {
  const [, ref] = useDrop({
    accept: ['image'],
    drop(item) {
      console.log(item);
    },
  });
  return <div ref={ref} src={logo} className={className} />;
};

export default Bucket;
