import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { BoardObjectType, BucketPositionsMapper, Log, Rule } from '../@types/index';
import { afterDragTimeout, bucketOrder, initialBoardObjects } from '../constants';
import Board from './Board';
import { closestBucketsMapper, setAllBucketsMapperCreator } from './__helpers__/buckets';

type State = {
  boardObjects: BoardObjectType[];
  gameId: number;
};

type Action = { type: 'SET_BOARD_OBJECTS'; mapper: BucketPositionsMapper };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_BOARD_OBJECTS':
      return {
        ...state,
        boardObjects: initialBoardObjects.map(action.mapper),
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
    boardObjects: initialBoardObjects.map(setAllBucketsMapperCreator(['TL', 'TR', 'BR', 'BL'])),
    gameId: 0,
  });

  const setMapper = (mapper: BucketPositionsMapper) =>
    dispatch({ type: 'SET_BOARD_OBJECTS', mapper });

  // Won't cause an update.
  const ref = useRef<{ index: undefined | number }>({
    index: undefined,
  });

  useEffect(() => {
    if (rule === 'clockwise') {
      // SET_BOARD_OBJECTS_BUCKETS
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

          setTimeout(() => {
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
      initialBoardObjects={boardObjects}
    />
  );
};

export default Game;
