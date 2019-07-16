import { createReducer, ActionType } from 'typesafe-actions';
import { initBoard, resetBoard, move, updateBoardObject } from '../actions/game';
import {
  initialBucketsMapper,
  setAllBucketsMapperCreator,
  closestBucketsMapper,
} from '../../components/__helpers__/buckets';
import { initialBoardObjects, bucketOrder } from '../../constants/index';
import { BucketPosition, BoardObjectType, Rule, Log } from '../../@types/index';

export type Action = ActionType<typeof import('../actions/game')>;

type State = {
  boardObjectsById: { [id: number]: BoardObjectType };
  moveNum: number;
  boardId: number;
  rule: Rule;
  logs: Log[];
};

export default createReducer<State, Action>({
  boardObjectsById: initialBoardObjects
    .map((mininmalBoardObjectType) => ({
      ...mininmalBoardObjectType,
      buckets: new Set<BucketPosition>(),
      draggable: true,
    }))
    .map(initialBucketsMapper)
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id]: curr,
      }),
      {},
    ),
  boardId: 0,
  moveNum: 1,
  logs: [],
  rule: 'clockwise',
})
  .handleAction(initBoard, (state, action) => ({
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
    rule: action.payload.rule,
    logs: [],
  }))
  .handleAction(resetBoard, (state) => ({
    ...state,
    boardObjectsById: initialBoardObjects
      .map((mininmalBoardObjectType) => ({
        ...mininmalBoardObjectType,
        buckets: new Set<BucketPosition>(),
        draggable: true,
      }))
      .map(initialBucketsMapper)
      .reduce(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr,
        }),
        {},
      ),
    boardId: 0,
    moveNum: 1,
    logs: [],
    rule: 'clockwise',
  }))
  .handleAction(move, (state, action) => {
    let mapper;
    switch (state.rule) {
      case 'clockwise': {
        const newIndex =
          (bucketOrder.indexOf(action.payload.dropSuccess.dropped) + 1) % bucketOrder.length;
        mapper = setAllBucketsMapperCreator([bucketOrder[newIndex]]);
        break;
      }
      case 'closest':
        mapper = closestBucketsMapper;
        break;
      default:
        mapper = (boardObject: BoardObjectType) => boardObject;
    }
    return {
      ...state,
      boardObjectsById: Object.values(state.boardObjectsById)
        .map(mapper)
        .reduce(
          (acc, curr) => ({
            ...acc,
            [curr.id]: curr,
          }),
          {},
        ),
      moveNum: state.moveNum + 1,
      logs: [
        ...state.logs,
        {
          id: state.logs.length,
          data: {
            boardId: state.boardId,
            moveNum: state.moveNum,
            dropAttempts: action.payload.dropAttempts,
            dropSuccess: action.payload.dropSuccess,
            touchAttempts: action.payload.touchAttempts,
          },
        },
      ],
    };
  })
  .handleAction(updateBoardObject, (state, action) => ({
    ...state,
    boardObjectsById: {
      ...state.boardObjectsById,
      [action.payload.id]: {
        ...state.boardObjectsById[action.payload.id],
        ...action.payload.boardObject,
      },
    },
    moveNum: state.moveNum + 1,
  }));
