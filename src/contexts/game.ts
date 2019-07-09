import React, { Dispatch } from 'react';
import { BoardObjectId, BoardObjectType, DropAttempt, Log, Rule } from '../@types/index';
import {
  closestBucketsMapper,
  initialBucketsMapper,
  setAllBucketsMapperCreator,
} from '../components/__helpers__/buckets';
import { bucketOrder } from '../constants/index';

// TODO: May be useful for reusing for initial state and reducer cases.
// const createNewBoardObjectsByIdMapper = (boardObjectsById: { [id: number]: BoardObjectType }) => (
//   mapper: BoardObjectsMapper,
// ) =>
//   Object.values(boardObjectsById)
//     .map(mapper)
//     .reduce(
//       (acc, curr) => ({
//         ...acc,
//         [curr.id]: curr,
//       }),
//       {},
//     );

type State = {
  boardObjectsById: { [id: number]: BoardObjectType };
  moveNum: number;
  boardId: number;
  rule: Rule;
  logs: Log[];
};

type Action =
  | {
      type: 'MOVE';
      touchAttempts: BoardObjectId[];
      dropAttempts: DropAttempt[];
      dropSuccess: DropAttempt;
    }
  | {
      type: 'UPDATE_BOARD_OBJECT';
      id: number;
      boardObject: Partial<BoardObjectType>;
    }
  | {
      type: 'INIT_BOARD';
      rule: Rule;
    };

export const gameReducer = (state: State, action: Action): State => {
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
        rule: action.rule,
        logs: [],
      };
    case 'MOVE': {
      let mapper;
      switch (state.rule) {
        case 'clockwise': {
          const newIndex =
            (bucketOrder.indexOf(action.dropSuccess.dropped) + 1) % bucketOrder.length;
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
              dropAttempts: action.dropAttempts,
              dropSuccess: action.dropSuccess,
              touchAttempts: action.touchAttempts,
            },
          },
        ],
      };
    }
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

// TODO:
// It will be set by the time we dispatch anything.
// Redux will be replacing this very soon.
export const GameDispatch: React.Context<React.Dispatch<Action>> = React.createContext<
  Dispatch<Action>
  // @ts-ignore
>(null);
