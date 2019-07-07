import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { BoardObjectId, boardObjectsMapper, BoardObjectType, BucketPosition, BucketType, DropAttempt, Log, Rule } from '../@types/index';
import { afterDragTimeout, bucketOrder, initialBoardObjects } from '../constants';
import Board from './Board';
import { closestBucketsMapper, initialBucketsMapper, setAllBucketsMapperCreator } from './__helpers__/buckets';

type Options = {
  incrementMoveNum: boolean;
  resetMoveNum: boolean;
};

type State = {
  boardObjectsById: { [id: number]: BoardObjectType };
  moveNum: number;
  boardId: number;
};

type Action =
  | {
      type: 'SET_BOARD_OBJECTS_USING_MAPPER';
      mapper: boardObjectsMapper;
      options?: Partial<Options>;
    }
  | {
      type: 'UPDATE_BOARD_OBJECT';
      id: number;
      boardObject: Partial<BoardObjectType>;
      options?: Partial<Options>;
    }
  | {
      type: 'INIT_BOARD';
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INIT_BOARD':
      return {
        ...state,
        boardObjectsById: Object.values(state.boardObjectsById)
          .map(initialBucketsMapper)
          .reduce(
            (acc, curr) => ({
              ...acc,
              [curr.id]: curr,
            }),
            {},
          ),
        moveNum: 1,
        boardId: state.boardId + 1,
      };
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
        moveNum: state.moveNum + 1,
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
        moveNum: state.moveNum + 1,
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
  const [{ boardObjectsById, moveNum, boardId }, dispatch] = useReducer(reducer, {
    boardObjectsById: initialBoardObjects.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id]: {
          ...curr,
          draggable: true,
          buckets: new Set(),
        },
      }),
      {},
    ),
    boardId: 0,
    moveNum: 1,
  });

  const [pause, setPause] = useState<boolean>(false);
  const [disabledBucket, setDroppedBucket] = useState<BucketPosition | undefined>(undefined);

  const setMapper = (mapper: boardObjectsMapper) =>
    dispatch({ type: 'SET_BOARD_OBJECTS_USING_MAPPER', mapper });
  const updateBoardObject = (id: number, boardObject: Partial<BoardObjectType>) =>
    dispatch({ type: 'UPDATE_BOARD_OBJECT', id, boardObject });
  const initBoard = () =>
    dispatch({
      type: 'INIT_BOARD',
    });

  // Won't cause an update.
  const ref = useRef<{
    index: undefined | number;
    prevRule: Rule | undefined;
    prevPrevRule: Rule | undefined;
    logId: number;
    touchAttempts: BoardObjectId[];
    dropAttempts: DropAttempt[];
  }>({
    index: undefined,
    prevRule: undefined,
    prevPrevRule: undefined,
    logId: 0,
    dropAttempts: [],
    touchAttempts: [],
  });

  useEffect(() => {
    initBoard();
    ref.current = {
      ...ref.current,
      dropAttempts: [],
      touchAttempts: [],
    };
  }, [rule]);

  useEffect(() => {
    if (moveNum === 2) {
      if (rule === 'closest') {
        setMapper(closestBucketsMapper);
      }
    }
  }, [moveNum, rule]);

  return (
    <Board
      className={className}
      onBoardObjectClick={(boardObject) =>  ref.current.touchAttempts.push(boardObject.id)}
      boardObjects={useMemo(() => Object.values(boardObjectsById), [boardObjectsById])}
      pause={pause}
      disabledBucket={disabledBucket}
      onDrop={(bucket: BucketType) => (
        droppedItem
        // @ts-ignore (Should really be void but the defined return type is undefined.)
      ): undefined => {
        if (disabledBucket) {
          return;
        }
        const { current } = ref;
        current.dropAttempts.push({ dragged: droppedItem.id, dropped: bucket.pos });

        // Don't put in canDrop because we want to bait the user to dropping items.
        // (The cursor will change to the drop cursor.)
        if (droppedItem.buckets.has(bucket.pos)) {

          const { current } = ref;
          const dropSuccess = current.dropAttempts[current.dropAttempts.length - 1];
          addLog({ id: ref.current.logId, data: { boardId, moveNum,  dropAttempts: current.dropAttempts,
            touchAttempts: current.touchAttempts,
            dropSuccess,
           } });
          updateBoardObject(dropSuccess.dragged, {
            shape: 'check',
            draggable: false,
          });
          setPause(true);
          setDroppedBucket(dropSuccess.dropped);
          setTimeout(() => {
            setPause(false);
            setDroppedBucket(undefined);
            if (rule === 'clockwise') {
              current.index =
                ((current.index !== undefined
                  ? current.index
                  : bucketOrder.indexOf(dropSuccess.dropped)) +
                  1) %
                bucketOrder.length;
              setMapper(setAllBucketsMapperCreator([bucketOrder[current.index]]));
            } else if (rule === 'closest') {
              // setMapper(closestBucketsMapper, { incrementMoveNum: true });
            }
          }, afterDragTimeout);

          // onSuccessfulMove({
          //   boardId,
          //   dropAttempts: current.dropAttempts,
          //   touchAttempts: current.touchAttempts,
          //   dropSuccess: current.dropAttempts[current.dropAttempts.length - 1],
          // });
        }
      }}
    />
  );
};

export default Game;
