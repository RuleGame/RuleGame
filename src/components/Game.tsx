import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { boardObjectsMapper, BoardObjectType, BucketPosition, Log, Rule } from '../@types/index';
import { afterDragTimeout, bucketOrder, initialBoardObjects } from '../constants';
import Board from './Board';
import {
  checkObjectMapperCreator,
  closestBucketsMapper,
  setAllBucketsMapperCreator,
} from './__helpers__/buckets';

type State = {
  boardObjects: BoardObjectType[];
  gameId: number;
};

type Action = { type: 'SET_BOARD_OBJECTS'; mapper: boardObjectsMapper };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_BOARD_OBJECTS':
      return {
        ...state,
        boardObjects: state.boardObjects.map(action.mapper),
        gameId: state.gameId + 1,
      };
    default:
      return state;
  }
};

type GameProps = {
  rule: Rule;
  addLog: (log: Log) => void;
  className?: string;
};

const Game = ({ rule, addLog, className }: GameProps): JSX.Element => {
  const [{ gameId, boardObjects }, dispatch] = useReducer(reducer, {
    boardObjects: initialBoardObjects.map((boardObject) => ({
      ...boardObject,
      draggable: true,
      buckets: new Set<BucketPosition>(),
    })),
    gameId: 0,
  });

  const [pause, setPause] = useState<boolean>(false);
  const [droppedBucket, setDroppedBucket] = useState<BucketPosition | undefined>(undefined);

  const setMapper = (mapper: boardObjectsMapper) => dispatch({ type: 'SET_BOARD_OBJECTS', mapper });

  // Won't cause an update.
  const ref = useRef<{ index: undefined | number }>({
    index: undefined,
  });

  useEffect(() => {
    if (rule === 'clockwise') {
      setMapper(setAllBucketsMapperCreator(['TL', 'TR', 'BR', 'BL']));
      ref.current.index = undefined;
    } else if (rule === 'closest') {
      setMapper(closestBucketsMapper);
    }
  }, [rule]);

  return (
    <Board
      id={gameId}
      className={className}
      onComplete={useCallback(
        (log) => {
          const { current } = ref;
          addLog(log);
          setMapper(checkObjectMapperCreator(log.dropSuccess.dragged));
          setPause(true);
          setDroppedBucket(log.dropSuccess.dropped);
          setTimeout(() => {
            setPause(false);
            setDroppedBucket(undefined);
            if (rule === 'clockwise') {
              current.index =
                ((current.index !== undefined
                  ? current.index
                  : bucketOrder.indexOf(log.dropSuccess.dropped)) +
                  1) %
                bucketOrder.length;
              setMapper(setAllBucketsMapperCreator([bucketOrder[current.index]]));
            } else if (rule === 'closest') {
              setMapper(closestBucketsMapper);
            }
          }, afterDragTimeout);
        },
        [rule, addLog],
      )}
      boardObjects={boardObjects}
      pause={pause}
      droppedBucket={droppedBucket}
    />
  );
};

export default Game;
