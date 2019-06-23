import React from 'react';
import { useDrag } from 'react-dnd';
import logo from '../logo.svg';

type Props = {
  className?: string,
};

const BoardObject = ({ className }: Props) => {
  const [, ref] = useDrag({
    item: { id: 1, type: 'image' },
  });
  return <div ref={ref} src={logo} className={className} />;
};

export default BoardObject;
