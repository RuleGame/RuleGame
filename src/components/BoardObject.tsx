import React from 'react';
import { useDrag } from 'react-dnd';
import logo from '../logo.svg';
import { BoardObjectItem } from '../@types';

export type BoardObjectProps = {
  className?: string;
  item: BoardObjectItem;
  onClick: Function;
};

const BoardObject = ({ className, item, onClick }: BoardObjectProps): JSX.Element => {
  const [, ref] = useDrag({
    item,
  });
  return (
    // @ts-ignore
    <div ref={ref} src={logo} className={className} onClick={onClick} />
  );
};

export default BoardObject;
