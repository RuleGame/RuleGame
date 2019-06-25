import React from 'react';
import { useDrag, DragObjectWithType } from 'react-dnd';
import logo from '../logo.svg';

export type BoardObjectProps = {
  className?: string;
  // TODO: Use Item type instead.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: { [key: string]: any } & DragObjectWithType;
};

const BoardObject = ({ className, item }: BoardObjectProps): JSX.Element => {
  const [, ref] = useDrag({
    item,
  });
  // @ts-ignore
  return <div ref={ref} src={logo} className={className} />;
};

export default BoardObject;
