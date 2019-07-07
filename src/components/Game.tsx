import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { boardObjectsMapper, BoardObjectType, BucketPosition, Log, Rule } from '../@types/index';
import { afterDragTimeout, bucketOrder, initialBoardObjects } from '../constants';
import Board from './Board';
import { closestBucketsMapper, setAllBucketsMapperCreator } from './__helpers__/buckets';

type State = {
  boardObjectsById: { [id: number]: BoardObjectType };
  gameId: number;
};

type Action =
  | { type: 'SET_BOARD_OBJECTS_USING_MAPPER'; mapper: boardObjectsMapper }
  | { type: 'UPDATE_BOARD_OBJECT'; id: number; boardObject: Partial<BoardObjectType> };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_BOARD_OBJECTS_USING_MAPPER':
      return {
        ...state,
        boardObjectsById: Object.values(state.boardObjectsById)
          .map(action.mapper)
          .reduce(
            (acc, curr) => ({
              ...acc,
              [curr.id]: curr,
            }),
            {},
          ),
        gameId: state.gameId + 1,
      };
    case 'UPDATE_BOARD_OBJECT':
      return {
        ...state,
        boardObjectsById: {
          ...state.boardObjectsById,
          [action.id]: {
            ...state.boardObjectsById[action.id],
            ...action.boardObject,
          },
        },
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
  const [{ gameId, boardObjectsById }, dispatch] = useReducer(reducer, {
    boardObjectsById: initialBoardObjects.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id]: {
          ...curr,
          draggable: true,
          buckets: new Set<BucketPosition>(),
        },
      }),
      {},
    ),
    gameId: 0,
  });

  const [pause, setPause] = useState<boolean>(false);
  const [droppedBucket, setDroppedBucket] = useState<BucketPosition | undefined>(undefined);

  const setMapper = (mapper: boardObjectsMapper) =>
    dispatch({ type: 'SET_BOARD_OBJECTS_USING_MAPPER', mapper });
  const updateBoardObject = (id: number, boardObject: Partial<BoardObjectType>) =>
    dispatch({ type: 'UPDATE_BOARD_OBJECT', id, boardObject });

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
          updateBoardObject(log.dropSuccess.dragged, {
            shape: 'check',
            draggable: false,
          });
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
      boardObjects={useMemo(() => Object.values(boardObjectsById), [boardObjectsById])}
      pause={pause}
      droppedBucket={droppedBucket}
    />
  );
};

export default Game;
