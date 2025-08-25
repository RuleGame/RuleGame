import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Box, Grid } from 'grommet';
import { useMeasure } from 'react-use';
import { BucketType } from '../@types';
import { buckets, cols, rows } from '../constants';
import BoardObject from './BoardObject';
import Bucket from './Bucket';
import BucketDropList from './BucketDropList';
import {
  boardObjectsSelector,
  bucketShapesSelector,
  displayBucketDropListsSelector,
  moveNumByBoardObjectSelector,
  is2PGAdveGameSelector,
  is2PGCoopGameSelector,
} from '../store/selectors/board';
import { BoardObject as BoardObjectType } from '../utils/api';
import { BucketPosition } from '../constants/BucketPosition';

const StyledBoard = styled.div<{}>`
  display: grid;
  grid-template-rows: repeat(${rows}, ${100 / rows}%);
  grid-template-columns: repeat(${cols}, ${100 / cols}%);
  height: 100%;
  width: 100%;
  position: relative;
  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

const StyledBoardObject = styled(BoardObject)<{ boardObject: BoardObjectType }>`
  grid-column: ${({ boardObject }) => boardObject.x + 1};
  grid-row: ${({ boardObject }) => rows - boardObject.y};
`;

const StyledBucket = styled(Bucket)<BucketType>`
  grid-column: ${(bucketCoord) => bucketCoord.x + 1};
  grid-row: ${(bucketCoord) => rows - bucketCoord.y};
`;

const OverlayWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(128, 128, 128, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const OverlayText = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

type BoardProps = {
  className?: string;
  paused: boolean;
  isPlayerTurn: boolean;
};

enum GridAreaName {
  TL = 'TL',
  TR = 'TR',
  BL = 'BL',
  BR = 'BR',
  BOARD = 'BOARD',
}

const Board = ({ className, isPlayerTurn }: BoardProps): JSX.Element => {
  const moveNumByBoardObject = useSelector(moveNumByBoardObjectSelector);
  const bucketShapes = useSelector(bucketShapesSelector);
  const boardObjects = useSelector(boardObjectsSelector);
  const is2PGadve = useSelector(is2PGAdveGameSelector);
  const is2PGcoop = useSelector(is2PGCoopGameSelector);
  const displayBucketDropLists = useSelector(displayBucketDropListsSelector);
  const [ref, { height, width }] = useMeasure();

  return (
    <Box justify="center" align="center" ref={ref} fill>
      <Grid
        fill
        // fill="vertical"
        style={{ width: `${height}px`, height: `${height}px`, overflow: 'hidden' }}
        //style={{
        //         width: `${Math.min(width, height)}px`,
        //         height: `${Math.min(width, height)}px`,
        //         overflow: 'hidden',
        //       }}
        className={className}
        rows={['10%', '40%', '40%', '10%']}
        columns={['10%', '80%', '10%']}
        areas={[
          {
            name: GridAreaName.TL,
            start: [0, 0],
            end: [0, 1],
          },
          {
            name: GridAreaName.TR,
            start: [2, 0],
            end: [2, 1],
          },
          {
            name: GridAreaName.BL,
            start: [0, 2],
            end: [0, 3],
          },
          {
            name: GridAreaName.BR,
            start: [2, 2],
            end: [2, 3],
          },
          {
            name: GridAreaName.BOARD,
            start: displayBucketDropLists ? [1, 1] : [0, 0],
            end: displayBucketDropLists ? [1, 2] : [2, 3],
          },
        ]}
      >
        {displayBucketDropLists && (
          <>
            <Box gridArea={GridAreaName.TL} fill justify="center" align="center">
              <BucketDropList bucket={BucketPosition.TL} />
            </Box>
            <Box gridArea={GridAreaName.TR} fill justify="center" align="center">
              <BucketDropList bucket={BucketPosition.TR} />
            </Box>
            <Box gridArea={GridAreaName.BL} fill justify="center" align="center">
              <BucketDropList bucket={BucketPosition.BL} />
            </Box>
            <Box gridArea={GridAreaName.BR} fill justify="center" align="center">
              <BucketDropList bucket={BucketPosition.BR} />
            </Box>
          </>
        )}

        <Box gridArea={GridAreaName.BOARD} pad="xxsmall" fill>
          <StyledBoard>
            {boardObjects.map((boardObject) => (
              <StyledBoardObject
                key={boardObject.id}
                moveNum={moveNumByBoardObject[boardObject.id]}
                boardObject={boardObject}
              />
            ))}
            {buckets.map((bucket) => (
              <StyledBucket
                {...bucket}
                key={`${bucket.x}-${bucket.y}`}
                shape={bucketShapes[bucket.pos]}
                bucket={bucket}
              />
            ))}
            {!isPlayerTurn && (
              <OverlayWrapper>
                {is2PGadve && <OverlayText>Your adversary is thinking</OverlayText>}
                {is2PGcoop && <OverlayText>Your partner is thinking</OverlayText>}
              </OverlayWrapper>
            )}
          </StyledBoard>
        </Box>
      </Grid>
    </Box>
  );
};

export default Board;
