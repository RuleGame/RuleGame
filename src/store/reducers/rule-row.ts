import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import { getType } from 'typesafe-actions';
import {
  Atom,
  BoardObjectId,
  BoardObjectType,
  BucketPosition,
  DropAttempt,
  Shape,
} from '../../@types';
import { cols, rows } from '../../constants';
import { RootAction } from '../actions';
import {
  move,
  removeBoardObject,
  readRuleArray,
  touch,
  setRuleArray,
  setRuleRowIndex,
  resumeGame,
  enableDebugMode,
  disableDebugMode,
} from '../actions/rule-row';
import atomMatch from '../../utils/atom-match';

export type State = {
  // TODO: Extract the atom counters and bucketToAtomIds to top level to avoid redundant object spreading.
  atomCounts: { [atomId: string]: number };
  // Indexed by rule array index
  atomsByRowIndex: { [atomId: string]: Atom }[];
  boardObjectsToBucketsToAtoms: {
    [boardObjectId: string]: { [bucket: number]: Set<string> };
  };
  initialBoardObjectsById: {
    [boardObjectId: string]: BoardObjectType;
  };
  boardObjectsById: {
    [boardObjectId: string]: BoardObjectType;
  };
  totalMoveHistory: DropAttempt[];
  touchAttempts: BoardObjectId[];
  dropAttempts: DropAttempt[];
  ruleRowIndex: number;
  numRuleRows: number;
  lastMoveSuccessful: boolean;
  paused: boolean;
  debugMode: boolean;
};

export const initialState: State = {
  atomCounts: {},
  atomsByRowIndex: [],
  boardObjectsToBucketsToAtoms: {},
  initialBoardObjectsById: {},
  boardObjectsById: {},
  totalMoveHistory: [],
  touchAttempts: [],
  dropAttempts: [],
  ruleRowIndex: NaN,
  numRuleRows: 0,
  lastMoveSuccessful: false,
  paused: false,
  debugMode: false,
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(setRuleArray): {
      const boardObjectsById = keyBy(action.payload.boardObjects, (boardObject) => boardObject.id);

      return {
        ...state,
        atomCounts: action.payload.atomsByRowIndex.flat().reduce(
          (acc, atom) => ({
            ...acc,
            [atom.id]: atom.counter,
          }),
          {},
        ),
        boardObjectsToBucketsToAtoms: {},
        atomsByRowIndex: action.payload.atomsByRowIndex.map((atoms) =>
          keyBy(atoms, (atom) => atom.id),
        ),
        initialBoardObjectsById: boardObjectsById,
        boardObjectsById,
        ruleRowIndex: NaN,
        numRuleRows: action.payload.atomsByRowIndex.length,
        totalMoveHistory: [],
        dropAttempts: [],
        touchAttempts: [],
        lastMoveSuccessful: false,
        paused: false,
      };
    }
    case getType(setRuleRowIndex): {
      // Why we need to compute all possible moves:
      // 1. If no possible moves, advance to next rule row or end game.
      // (TODO: An epic must detect this and continue to the next rule row then)
      // 2. Hover thingy if possible to drop.
      return {
        ...state,
        ruleRowIndex: action.payload.index,
        boardObjectsToBucketsToAtoms: Object.values(state.boardObjectsById).reduce(
          (acc, boardObject) => ({
            ...acc,
            [boardObject.id]: {
              ...Object.values(state.atomsByRowIndex[action.payload.index])
                .filter(atomMatch(boardObject, state.atomCounts))
                .reduce<{ [bucket: number]: Set<string> }>(
                  (acc, atom) => {
                    atom.fns
                      .map((fn) =>
                        fn(boardObject.id, state.totalMoveHistory, state.initialBoardObjectsById),
                      )
                      .forEach((bucket) => {
                        if (Number.isNaN(bucket) && state.totalMoveHistory.length === 0) {
                          acc[BucketPosition.TR].add(atom.id);
                          acc[BucketPosition.TL].add(atom.id);
                          acc[BucketPosition.BR].add(atom.id);
                          acc[BucketPosition.BL].add(atom.id);
                        } else if (!Number.isNaN(bucket)) {
                          acc[bucket].add(atom.id);
                        }
                      });
                    return acc;
                  },
                  {
                    [BucketPosition.TR]: new Set<string>(),
                    [BucketPosition.TL]: new Set<string>(),
                    [BucketPosition.BR]: new Set<string>(),
                    [BucketPosition.BL]: new Set<string>(),
                  },
                ),
            },
          }),
          {},
        ),
      };
    }

    case getType(touch):
      return {
        ...state,
        touchAttempts: [...state.touchAttempts, action.payload.boardObjectId],
      };

    case getType(move): {
      const { dragged, dropped } = action.payload.dropAttempt;

      const matchedAtoms = Array.from(state.boardObjectsToBucketsToAtoms[dragged][dropped]);

      if (matchedAtoms.length === 0) {
        return {
          ...state,
          dropAttempts: [...state.dropAttempts, action.payload.dropAttempt],
          lastMoveSuccessful: false,
        };
      }

      return {
        ...state,
        atomCounts: matchedAtoms.reduce(
          (acc, atomId) => ({
            ...acc,
            [atomId]: state.atomCounts[atomId] - 1,
          }),
          state.atomCounts,
        ),
        boardObjectsById: {
          ...state.boardObjectsById,
          [dragged]: {
            ...state.boardObjectsById[dragged],
            shape: Shape.CHECK,
          },
        },
        dropAttempts: [...state.dropAttempts, action.payload.dropAttempt],
        totalMoveHistory: [...state.totalMoveHistory, action.payload.dropAttempt],
        lastMoveSuccessful: true,
        paused: true,
      };
    }

    case getType(removeBoardObject): {
      // FIXME: Removing is bad because it loses the references for the total history
      const {
        [action.payload.boardObjectId]: _2,
        ...newBoardObjectsToBucketsToAtoms
      } = state.boardObjectsToBucketsToAtoms;
      return {
        ...state,
        boardObjectsToBucketsToAtoms: newBoardObjectsToBucketsToAtoms,
      };
    }
    case getType(resumeGame):
      return {
        ...state,
        paused: false,
      };

    case getType(enableDebugMode):
      return {
        ...state,
        debugMode: true,
      };
    case getType(disableDebugMode):
      return {
        ...state,
        debugMode: false,
      };

    default:
      return state;
  }
};

export default reducer;
