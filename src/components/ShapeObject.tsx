import React from 'react';
import ReactTooltip from 'react-tooltip';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Close } from 'grommet-icons';
import { Color } from '../constants/Color';
import { Shape } from '../constants/Shape';
import { api, METHOD } from '../utils/api';
import { useColorRgb } from '../utils/hooks';

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
  showInvalidDropX?: boolean;
  size?: number;
  backgroundColor?: string;
  round?: 'small' | 'medium' | 'large' | 'full';
};

const StyledBoardObject = styled.div<
  Pick<
    ShapeProps,
    'opacity' | 'canDrag' | 'onClick' | 'color' | 'size' | 'backgroundColor' | 'round'
  >
>`
  position: relative;
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
    transform: ${({ size }) => (size ? `scale(${size})` : 'none')};
    background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
    border-radius: ${({ round }) => {
      switch (round) {
        case 'small':
          return '4px';
        case 'medium':
          return '8px';
        case 'large':
          return '16px';
        case 'full':
          return '50%';
        default:
          return '0';
      }
    }};
  }
`;

const dataForPrefix = 'shape-object-';
const CACHE_PREFIX = 'svg-cache-';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

const getCacheKey = (shape: Shape) => `${CACHE_PREFIX}${shape}`;

const getFromCache = (shape: Shape): { data: string; timestamp: number } | null => {
  const cached = localStorage.getItem(getCacheKey(shape));
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(getCacheKey(shape));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const setInCache = (shape: Shape, svgString: string) => {
  const cacheData = {
    data: svgString,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(getCacheKey(shape), JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache SVG:', error);
  }
};

const ShapeObject = React.forwardRef<HTMLDivElement, ShapeProps>(
  (
    {
      opacity = 1,
      shape,
      className,
      shapeObjectId,
      onClick,
      debugInfo,
      color,
      showInvalidDropX,
      size = 1,
      backgroundColor,
      round,
    },
    ref,
  ) => {
    const { data: svgString } = useQuery(
      `ShapeObject-${shape}`,
      async () => {
        const cached = getFromCache(shape);
        if (cached) return cached.data;

        const response = await api('/admin/getSvg.jsp', METHOD.GET, undefined, { shape });
        const svgData = response.data;

        setInCache(shape, svgData);

        return svgData;
      },
      {
        staleTime: CACHE_EXPIRY,
        cacheTime: CACHE_EXPIRY,
      },
    );

    const colorRgb = useColorRgb(color);

    // Parse SVG and inject cross if needed
    const modifiedSvgString =
      showInvalidDropX && svgString
        ? svgString.replace(
            '</svg>',
            `
      <g style="pointer-events: none;">
        <path d="M20,20 L50,50 M50,20 L20,50"
          stroke="black"
          stroke-width="10"
          stroke-linecap="round"
          fill="none"
          style="z-index: 9999; position: absolute;"/>
      </g>
    </svg>`,
          )
        : svgString;

    return (
      <>
        <StyledBoardObject
          data-tip
          data-for={`${dataForPrefix}${shapeObjectId}`}
          className={className}
          ref={ref}
          onClick={onClick}
          data-shape={shape}
          dangerouslySetInnerHTML={{ __html: modifiedSvgString ?? '' }}
          color={colorRgb}
          opacity={opacity}
          size={size}
          backgroundColor={backgroundColor}
          round={round}
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
