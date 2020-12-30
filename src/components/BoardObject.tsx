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
import { BoardObject as BoardObjectType } from '../utils/api';
import { Color } from '../constants/Color';
import { Shape } from '../constants/Shape';
import {
  isGameCompletedSelector,
  isPausedSelector,
  showGridMemoryOrderSelector,
} from '../store/selectors/board';
import { debugModeSelector } from '../store/selectors/debug-mode';
import { RootAction } from '../store/actions';
import { pick } from '../store/actions/board';
import { useColorRgb } from '../utils/hooks';

export type BoardObjectProps = {
  className?: string;
  boardObject: BoardObjectType;
  shape: Shape;
  color: Color;
  moveNum?: number;
};

const StyledShapeObject = styled(ShapeObject)<{ canDrag: boolean }>`
  width: 100%;
  height: 100%;
  cursor: ${({ canDrag }) => (canDrag ? 'grab' : 'unset')};
`;

const BoardObject = ({
  className,
  boardObject,
  shape,
  color,
  moveNum,
}: BoardObjectProps): JSX.Element => {
  const dispatch: Dispatch<RootAction> = useDispatch();
  const hasBeenDropped = boardObject.dropped !== undefined;
  const gameCompleted = useSelector(isGameCompletedSelector);
  const debugMode = useSelector(debugModeSelector);
  const isPaused = useSelector(isPausedSelector);

  const canDrag = boardObject.buckets.length > 0 && !gameCompleted && !isPaused;
  const [, ref] = useDrag({
    item: {
      ...boardObject,
      type: 'object',
    },
    canDrag,
  });
  const showGridMemoryOrder = useSelector(showGridMemoryOrderSelector);
  const debugInfo = useMemo(
    () =>
      `${Object.entries({
        id: boardObject.id,
        color: boardObject.color,
        shape: boardObject.shape,
        x: boardObject.x,
        y: boardObject.y,
      }).reduce(
        (acc2, [key, value]) => `${acc2}${key}: ${value}\n`,
        '',
      )}buckets: [${boardObject.buckets.join(',')}]\n`,
    [boardObject],
  );

  const colorRgb = useColorRgb(color);

  return (
    <Stack
      className={className}
      data-cy={cyBoardObject(boardObject.id)}
      data-cy-checked={hasBeenDropped}
      onMouseDown={() => dispatch(pick(boardObject.id))}
      fill
    >
      <StyledShapeObject
        shape={shape}
        // Default to transparent until we get the RGB format from the api call.
        color={colorRgb ?? 'transparent'}
        ref={ref}
        canDrag={canDrag}
        shapeObjectId={boardObject.id}
        debugInfo={debugMode ? debugInfo : undefined}
      />
      {hasBeenDropped && <FiCheck color="green" size="100%" />}
      {!hasBeenDropped && boardObject.buckets.length === 0 && <Close size="100%" color="black" />}
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
