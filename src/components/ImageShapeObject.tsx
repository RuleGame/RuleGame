import React from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { getImageUrl } from '../utils/api';

export type ImageShapeProps = {
  ref: React.Ref<HTMLDivElement>;
  className?: string;
  shapeObjectId?: number | string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  debugInfo?: string;
  canDrag?: boolean;
  opacity?: number;
  image: string;
};

const StyledBoardObject = styled.div<{
  opacity?: number;
  canDrag?: boolean;
  onClick?: Function;
  image: string;
}>`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: ${({ opacity }) => opacity};
  cursor: ${({ onClick, canDrag }) => (onClick && !canDrag ? 'not-allowed' : undefined)};
  background-image: ${({ image }) => `url(${getImageUrl(image)})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;
const dataForPrefix = 'shape-object-';

const ImageShapeObject = React.forwardRef<HTMLDivElement, ImageShapeProps>(
  ({ opacity = 1, className, shapeObjectId, onClick, debugInfo, image }, ref) => {
    // noinspection HtmlUnknownBooleanAttribute
    return (
      <>
        <StyledBoardObject
          data-tip
          data-for={`${dataForPrefix}${shapeObjectId}`}
          className={className}
          ref={ref}
          onClick={onClick}
          opacity={opacity}
          image={image}
        />
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

export default ImageShapeObject;
