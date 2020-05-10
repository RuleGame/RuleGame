import React from 'react';
import ReactTooltip from 'react-tooltip';
import { FiCircle, FiSquare, FiStar, FiTriangle, FiCheck } from 'react-icons/fi';
import HappyFace from '../assets/smiley-face.png';
import bucketSvg from '../assets/bucket.svg';
import { cyShapeObject } from '../constants/data-cy-builders';
import { Shape, Color } from '../@types';

export type ShapeProps = {
  ref: React.Ref<HTMLDivElement>;
  shape: Shape;
  className?: string;
  shapeObjectId?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  debugInfo?: string;
  color?: Color;
};

const shapesMapping: (color?: string) => { [shape in Shape]: JSX.Element | null } = (color) => ({
  star: <FiStar size="100%" color={color} />,
  circle: <FiCircle size="100%" color={color} />,
  square: <FiSquare size="100%" color={color} />,
  triangle: <FiTriangle size="100%" color={color} />,
  happy: <img src={HappyFace} alt="happy-face" height="100%" />,
  bucket: <img src={bucketSvg} alt="bucket" height="100%" />,
  check: <FiCheck color="green" size="100%" />,
  nothing: null,
  '*': <div>*</div>,
});

const ShapeObject = React.forwardRef<HTMLDivElement, ShapeProps>(
  ({ shape, className, shapeObjectId, onClick = () => {}, debugInfo, color }, ref) => {
    // noinspection HtmlUnknownBooleanAttribute
    return (
      <>
        <div
          data-tip
          data-for={shapeObjectId}
          className={className}
          ref={ref}
          data-cy={shapeObjectId && cyShapeObject(shapeObjectId)}
          onClick={onClick}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
          data-shape={shape}
        >
          {shapesMapping(color)[shape]}
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
