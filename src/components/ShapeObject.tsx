import React from 'react';
import ReactTooltip from 'react-tooltip';
import { FiCircle, FiSquare, FiStar, FiTriangle } from 'react-icons/fi';
import HappyFace from '../assets/smiley-face.png';
import bucketSvg from '../assets/bucket.svg';
import unhappyFace from '../assets/unhappy-face.svg';
import { VALID_SHAPES } from '../@types';
import { Color } from '../constants/Color';
import { Shape } from '../constants/Shape';

export type ShapeProps = {
  ref: React.Ref<HTMLDivElement>;
  shape: Shape;
  className?: string;
  shapeObjectId?: number | string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  debugInfo?: string;
  color?: Color;
  canDrag?: boolean;
  opacity?: number;
};

const shapesMapping: (color?: string) => { [shape in Shape]: JSX.Element | null } = (color) => ({
  STAR: <FiStar size="100%" color={color?.toLowerCase()} />,
  CIRCLE: <FiCircle size="100%" color={color?.toLowerCase()} />,
  SQUARE: <FiSquare size="100%" color={color?.toLowerCase()} />,
  TRIANGLE: <FiTriangle size="100%" color={color?.toLowerCase()} />,
  HAPPY: <img src={HappyFace} alt="happy-face" height="100%" />,
  BUCKET: <img draggable={false} src={bucketSvg} alt="bucket" height="100%" />,
  NOTHING: null,
  '*': <div>*</div>,
  UNHAPPY: <img src={unhappyFace} alt="unhappy-face" height="100%" />,
});

const dataForPrefix = 'shape-object-';

const ShapeObject = React.forwardRef<HTMLDivElement, ShapeProps>(
  ({ opacity = 1, shape, className, shapeObjectId, onClick, debugInfo, color, canDrag }, ref) => {
    // noinspection HtmlUnknownBooleanAttribute
    return (
      <>
        <div
          data-tip
          data-for={`${dataForPrefix}${shapeObjectId}`}
          className={className}
          ref={ref}
          onClick={onClick}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            opacity,
            cursor: onClick && !canDrag && VALID_SHAPES.has(shape) ? 'not-allowed' : undefined,
          }}
          data-shape={shape}
        >
          {shapesMapping(color === undefined ? undefined : color)[shape]}
        </div>
        {debugInfo && (
          <ReactTooltip id={`${dataForPrefix}${shapeObjectId}`} type="error">
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
