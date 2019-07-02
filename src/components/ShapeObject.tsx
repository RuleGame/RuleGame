import React from 'react';
import { FiCircle, FiSquare, FiStar, FiTriangle } from 'react-icons/fi';
import { Shape } from '../@types';
import HappyFace from '../assets/smiley-face.png';
import bucketSvg from '../assets/bucket.svg';

export type ShapeProps = {
  ref: React.Ref<HTMLDivElement>;
  shape: Shape;
};

const shapesMapping: { [shape in Shape]: JSX.Element | null } = {
  star: <FiStar size="100%" />,
  circle: <FiCircle size="100%" />,
  square: <FiSquare size="100%" />,
  triangle: <FiTriangle size="100%" />,
  happy: <img src={HappyFace} alt="happy-face" width="100%" height="100%" />,
  bucket: <img src={bucketSvg} alt="bucket" width="100%" height="100%" />,
  nothing: null,
};

const ShapeObject = React.forwardRef<HTMLDivElement, ShapeProps>(({ shape, ...props }, ref) => {
  return (
    <div {...props} ref={ref}>
      {shapesMapping[shape]}
    </div>
  );
});

export default ShapeObject;
