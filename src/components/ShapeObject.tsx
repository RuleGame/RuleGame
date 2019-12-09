import React from 'react';
import ReactTooltip from 'react-tooltip';
import { FiCircle, FiSquare, FiStar, FiTriangle, FiCheck } from 'react-icons/fi';
import HappyFace from '../assets/smiley-face.png';
import bucketSvg from '../assets/bucket.svg';
import { shapeObjectCy } from '../constants/data-cy-builders';
import { Shape } from '../@types';

export type ShapeProps = {
  ref: React.Ref<HTMLDivElement>;
  shape: Shape;
  className?: string;
  shapeObjectId: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  debugInfo?: string;
};

const shapesMapping: { [shape in Shape]: JSX.Element | null } = {
  star: <FiStar size="100%" />,
  circle: <FiCircle size="100%" />,
  square: <FiSquare size="100%" />,
  triangle: <FiTriangle size="100%" />,
  happy: <img src={HappyFace} alt="happy-face" width="100%" height="100%" />,
  bucket: <img src={bucketSvg} alt="bucket" width="100%" height="100%" />,
  check: <FiCheck color="green" size="100%" />,
  nothing: null,
  '*': <div>*</div>,
};

const ShapeObject = React.forwardRef<HTMLDivElement, ShapeProps>(
  ({ shape, className, shapeObjectId, onClick, debugInfo }, ref) => {
    // noinspection HtmlUnknownBooleanAttribute
    return (
      <>
        <div
          data-tip
          data-for={shapeObjectId}
          className={className}
          ref={ref}
          data-cy={shapeObjectCy(shapeObjectId, shape)}
          onClick={onClick}
        >
          {shapesMapping[shape]}
        </div>
        {debugInfo && (
          <ReactTooltip id={shapeObjectId} type="error">
            <div>
              {debugInfo.split('\n').map((item) => {
                return <div key={item}>{item}</div>;
              })}
            </div>
          </ReactTooltip>
        )}
      </>
    );
  },
);

export default ShapeObject;
