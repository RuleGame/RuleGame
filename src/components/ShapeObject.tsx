import React from 'react';
import ReactTooltip from 'react-tooltip';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Color } from '../constants/Color';
import { Shape } from '../constants/Shape';
import { api, METHOD } from '../utils/api';

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

const StyledBoardObject = styled.div<Pick<ShapeProps, 'opacity' | 'canDrag' | 'onClick' | 'color'>>`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: ${({ opacity }) => opacity};
  cursor: ${({ onClick, canDrag }) => (onClick && !canDrag ? 'not-allowed' : undefined)};

  svg {
    width: 100%;
    height: 100%;
    color: ${({ color }) => color};
  }
`;
const dataForPrefix = 'shape-object-';

const ShapeObject = React.forwardRef<HTMLDivElement, ShapeProps>(
  ({ opacity = 1, shape, className, shapeObjectId, onClick, debugInfo, color }, ref) => {
    const { data: svgString } = useQuery(`ShapeObject-${shape}`, () =>
      api('/admin/getSvg.jsp', METHOD.GET, undefined, { shape }).then((response) => response.data),
    );
    // noinspection HtmlUnknownBooleanAttribute
    return (
      <>
        <StyledBoardObject
          data-tip
          data-for={`${dataForPrefix}${shapeObjectId}`}
          className={className}
          ref={ref}
          onClick={onClick}
          data-shape={shape}
          dangerouslySetInnerHTML={{ __html: svgString ?? '' }}
          color={color}
          opacity={opacity}
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

export default ShapeObject;
