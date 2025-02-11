import React, { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { Box, Stack, Text } from 'grommet';
import { Close } from 'grommet-icons';
import { FiCheck } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import ShapeObject from './ShapeObject';
import { cyBoardObject } from '../constants/data-cy-builders';
import { BoardObject as BoardObjectType, FeedbackSwitches } from '../utils/api';
import {
  feedbackSwitchesSelector,
  isGameCompletedSelector,
  isPausedSelector,
  showGridMemoryOrderSelector,
  lastMoveSelector,
} from '../store/selectors/board';
import { debugModeSelector } from '../store/selectors/debug-mode';
import { RootAction } from '../store/actions';
import { pick, setHoveredItem, resetHoveredItem } from '../store/actions/board';
import ImageShapeObject from './ImageShapeObject';

export type BoardObjectProps = {
  className?: string;
  boardObject: BoardObjectType;
  moveNum?: number;
};

const StyledShapeObject = styled(ShapeObject)<{
  canDrag: boolean;
  feedbackSwitches: FeedbackSwitches;
  isLastMoved: boolean;
}>`
  width: 100%;
  height: 100%;
  cursor: ${({ canDrag, feedbackSwitches }) =>
    canDrag || feedbackSwitches === FeedbackSwitches.FREE ? 'grab' : 'unset'};
  ${({ isLastMoved }) =>
    isLastMoved ? 'border: 3px solid black; border-radius: 8px; box-sizing: border-box;' : ''}
`;

const ImageStyledShapeObject = styled(ImageShapeObject)<{
  canDrag: boolean;
  feedbackSwitches: FeedbackSwitches;
  isLastMoved: boolean;
}>`
  width: 100%;
  height: 100%;
  cursor: ${({ canDrag, feedbackSwitches }) =>
    canDrag || feedbackSwitches === FeedbackSwitches.FREE ? 'grab' : 'unset'};
  ${({ isLastMoved }) =>
    isLastMoved ? 'border: 3px solid black; border-radius: 8px; box-sizing: border-box;' : ''}
`;

const BoardObject = ({ className, boardObject, moveNum }: BoardObjectProps): JSX.Element => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const hasBeenDropped = boardObject.dropped !== undefined;
  const gameCompleted = useSelector(isGameCompletedSelector);
  const debugMode = useSelector(debugModeSelector);
  const isPaused = useSelector(isPausedSelector);
  const feedbackSwitches = useSelector(feedbackSwitchesSelector);
  const lastMove = useSelector(lastMoveSelector);
  const isLastMovedPiece = lastMove?.pieceId === boardObject.id;

  const canDrag = boardObject.buckets.length > 0 && !gameCompleted && !isPaused;
  const [, ref] = useDrag({
    item: {
      ...boardObject,
      type: 'object',
    },
    canDrag,
    // Make a pick call whenever an object is dragged but not dropped
    end(item, monitor) {
      if (!monitor.didDrop() && !isPaused && !gameCompleted) {
        dispatch(pick(boardObject.id));
      }
    },
  });
  const showGridMemoryOrder = useSelector(showGridMemoryOrderSelector);
  const debugInfo = useMemo(
    () =>
      `${Object.entries({
        id: boardObject.id,
        ...(boardObject.color && { color: boardObject.color }),
        ...(boardObject.shape && { shape: boardObject.shape }),
        ...(boardObject.image && { image: boardObject.image }),
        x: boardObject.x,
        y: boardObject.y,
      }).reduce(
        (acc2, [key, value]) => `${acc2}${key}: ${value}\n`,
        '',
      )}buckets: [${boardObject.buckets.join(',')}]\n`,
    [boardObject],
  );

  return (
    <Stack
      className={className}
      data-cy={cyBoardObject(boardObject.id)}
      data-cy-checked={hasBeenDropped}
      // Make a pick call for nonmovable objects
      onMouseDown={() => {
        return !canDrag && !isPaused && !gameCompleted && dispatch(pick(boardObject.id));
      }}
      onMouseEnter={() => dispatch(setHoveredItem(boardObject))}
      onMouseLeave={() => dispatch(resetHoveredItem())}
      fill
    >
      {boardObject.image !== undefined ? (
        <ImageStyledShapeObject
          ref={ref}
          image={boardObject.image}
          canDrag={canDrag}
          feedbackSwitches={feedbackSwitches}
          shapeObjectId={boardObject.id}
          debugInfo={debugMode ? debugInfo : undefined}
          isLastMoved={isLastMovedPiece}
        />
      ) : (
        <StyledShapeObject
          shape={boardObject.shape}
          // Default to transparent until useQuery gets the RGB format from the api call.
          color={boardObject.color}
          ref={ref}
          canDrag={canDrag}
          feedbackSwitches={feedbackSwitches}
          shapeObjectId={boardObject.id}
          debugInfo={debugMode ? debugInfo : undefined}
          isLastMoved={isLastMovedPiece}
        />
      )}
      {hasBeenDropped && <FiCheck color="green" size="100%" />}

      {/* {hasBeenDropped && (
        <Box fill>
          <FiCheck color="green" size="100%" />
          {moveNum !== undefined && (
            <Box
              fill
              align="center"
              justify="center"
              style={{ position: 'absolute' }}
            >
              <Text weight="bold" size="medium" color="white">
                {moveNum}
              </Text>
            </Box>
          )}
        </Box>
      )} */}
      {!hasBeenDropped &&
        boardObject.buckets.length === 0 &&
        feedbackSwitches !== FeedbackSwitches.FREE && <Close size="100%" color="black" />}
      {showGridMemoryOrder && moveNum !== undefined && (
        <Box
          background="white"
          border={{ side: 'all', style: 'solid', color: 'black', size: 'small' }}
          round
          width="min-content"
          pad={{ left: 'xxsmall', right: 'xxsmall' }}
        >
          <Text weight="bold" size="xsmall">
            {moveNum}
          </Text>
        </Box>
      )}
    </Stack>
  );
};

export default BoardObject;
