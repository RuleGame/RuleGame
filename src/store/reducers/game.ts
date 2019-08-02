import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
import { BoardObjectType, BucketPosition, Log, Rule } from '../../@types/index';
import {
  blueSquareAnyBucket as blueSquareOnlyAnyBucket,
  closestBucket,
  setAllBucketsTo,
} from '../../components/__helpers__/rule-set-mappers';
import { bucketOrder, initialBoardObjects } from '../../constants/index';
import { initBoard, move, updateBoardObject, setRule } from '../actions/game';

export type Action = ActionType<typeof import('../actions/game')>;

type State = {
  boardObjectsById: { [id: number]: BoardObjectType };
  moveNum: number;
  boardId: number;
  rule: Rule;
  logs: Log[];
};

const initialState: State = {
  boardObjectsById: initialBoardObjects
    .map((mininmalBoardObjectType) => ({
      ...mininmalBoardObjectType,
      buckets: new Set<BucketPosition>(),
      draggable: true,
    }))
    .map(blueSquareOnlyAnyBucket) // Note: Remember to update based on initial rule!
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
  rule: 'clockwise', // Note: Remember to update initial mapper based on initial rule!
};

const reducer: Reducer<State, Action> = (state = initialState, action) => {
  switch (action.type) {
    case getType(setRule):
      return {
        ...state,
        rule: action.payload.rule,
      };
    case getType(initBoard):
      return {
        ...state,
        boardObjectsById: initialBoardObjects
          .map((mininmalBoardObjectType) => ({
            ...mininmalBoardObjectType,
            buckets: new Set<BucketPosition>(),
            draggable: true,
          }))
          .map(action.payload.positionsMapper)
          .map(action.payload.firstMoveMapper)
          .reduce(
            (acc, curr) => ({
              ...acc,
              [curr.id]: curr,
            }),
            {},
          ),
        moveNum: 1,
        boardId: state.boardId + 1,
        logs: [],
      };
    case getType(move): {
      let mapper;
      switch (state.rule) {
        case 'clockwise': {
          const newIndex =
            (bucketOrder.indexOf(action.payload.dropSuccess.dropped) + 1) % bucketOrder.length;
          mapper = setAllBucketsTo([bucketOrder[newIndex]]);
          break;
        }
        case 'closest':
          mapper = closestBucket;
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
    }
    case getType(updateBoardObject):
      return {
        ...state,
        boardObjectsById: {
          ...state.boardObjectsById,
          [action.payload.id]: {
            ...state.boardObjectsById[action.payload.id],
            ...action.payload.boardObject,
          },
        },
        moveNum: state.moveNum + 1,
      };
    default:
      return state;
  }
};

export default reducer;
