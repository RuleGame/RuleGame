import React from 'react';
import { useDrag } from 'react-dnd';
import logo from '../logo.svg';
import { Item } from '../@types';

export type BoardObjectProps = {
  className?: string;
  item: Item;
};

const BoardObject = ({ className, item }: BoardObjectProps): JSX.Element => {
  const [, ref] = useDrag({
    item,
  });
  // @ts-ignore
  return <div ref={ref} src={logo} className={className} />;
};

export default BoardObject;
