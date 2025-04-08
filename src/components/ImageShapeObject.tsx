import React, { useState, useEffect } from 'react';
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

export async function cacheImage(image: string): Promise<string> {
  const storageKey = `cached_image_${image}`;
  const url = getImageUrl(image);

  // Check if the Base64 image is already in localStorage
  const cached = localStorage.getItem(storageKey);
  if (cached) {
    return cached;
  }

  // Fetch the image from the provided URL
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  // Convert the fetched blob to a Base64 string
  const blob = await response.blob();
  const base64 = await convertBlobToBase64(blob);

  // Store the Base64 string in localStorage for future use
  localStorage.setItem(storageKey, base64);

  return base64;
}

function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Styled component expecting base64Image prop
const StyledBoardObject = styled.div<{
  opacity?: number;
  canDrag?: boolean;
  onClick?: Function;
  base64Image: string;
}>`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: ${({ opacity }) => opacity};
  cursor: ${({ onClick, canDrag }) => (onClick && !canDrag ? 'not-allowed' : 'default')};
  background-image: ${({ base64Image }) => (base64Image ? `url(${base64Image})` : 'none')};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;

const dataForPrefix = 'shape-object-';

const ImageShapeObject = React.forwardRef<HTMLDivElement, ImageShapeProps>(
  ({ opacity = 1, className, shapeObjectId, onClick, debugInfo, image }, ref) => {
    const [base64Image, setBase64Image] = useState<string>('');

    useEffect(() => {
      let isMounted = true;
      cacheImage(image)
        .then((base64) => {
          if (isMounted) {
            setBase64Image(base64);
          }
        })
        .catch((error) => {
          console.error('Error caching image:', error);
        });

      return () => {
        isMounted = false;
      };
    }, [image]);

    return (
      <>
        <StyledBoardObject
          data-tip
          data-for={`${dataForPrefix}${shapeObjectId}`}
          className={className}
          ref={ref}
          onClick={onClick}
          opacity={opacity}
          base64Image={base64Image}
        />
        {debugInfo && (
          <ReactTooltip id={`${dataForPrefix}${shapeObjectId}`} type="error">
            <div>
              {debugInfo.split('\n').map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </ReactTooltip>
        )}
      </>
    );
  },
);

export default ImageShapeObject;
