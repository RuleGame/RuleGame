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
import { RootAction } from '../actions';
import {
  completeGame,
  disableDebugMode,
  enableDebugMode,
  loadRuleArray,
  move,
  removeBoardObject,
  resumeGame,
  setRuleRowIndex,
  touch,
} from '../actions/rule-row';
import atomMatch, { xYToPosition } from '../../utils/atom-match';

export type State = {
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
  rawRuleArrayString?: string;
  gameCompleted: boolean;
  parsingRuleArray: boolean;
  error?: Error;
  order?: number[];
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
  rawRuleArrayString: undefined,
  gameCompleted: false,
  parsingRuleArray: false,
  error: undefined,
  order: [],
};

const reducer = (state: State = initialState, action: RootAction): State => {
  switch (action.type) {
    case getType(loadRuleArray): {
      const boardObjectsById = keyBy(action.payload.boardObjects, (boardObject) => boardObject.id);

      return {
        ...state,
        atomCounts: action.payload.ruleArray.flat().reduce(
          (acc, atom) => ({
            ...acc,
            [atom.id]: atom.counter,
          }),
          {},
        ),
        boardObjectsToBucketsToAtoms: {},
        atomsByRowIndex: action.payload.ruleArray.map((atoms) => keyBy(atoms, (atom) => atom.id)),
        initialBoardObjectsById: boardObjectsById,
        boardObjectsById,
        ruleRowIndex: NaN,
        numRuleRows: action.payload.ruleArray.length,
        totalMoveHistory: [],
        dropAttempts: [],
        touchAttempts: [],
        lastMoveSuccessful: false,
        paused: false,
        gameCompleted: false,
        parsingRuleArray: false,
        rawRuleArrayString: action.payload.rawRuleArrayString,
        order: action.payload.order,
      };
    }

    case getType(setRuleRowIndex): {
      // Why we need to compute all possible moves:
      // 1. If no possible moves, advance to next rule row or end game.
      // (An epic must detect this and continue to the next rule row then)
      // 2. Hover thingy if possible to drop.
      const preOrderBoardObjectsToBucketsToAtoms = Object.values(state.boardObjectsById)
        .filter((boardObject) => boardObject.shape !== Shape.CHECK)
        .reduce<{ [boardObjectId: string]: { [bucket: number]: Set<string> } }>(
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
                        if (Number.isNaN(bucket)) {
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
        );

      let boardObjectsToBucketsToAtoms = preOrderBoardObjectsToBucketsToAtoms;
      if (state.order) {
        const boardObjectsIdsByPosition: {
          [position: number]: string[];
        } = Object.entries(preOrderBoardObjectsToBucketsToAtoms).reduce<{
          [position: number]: string[];
        }>((acc, [boardObjectId, bucketsToAtoms]) => {
          if (Object.values(bucketsToAtoms).some((atoms) => atoms.size > 0)) {
            const pos = xYToPosition(
              state.initialBoardObjectsById[boardObjectId].x,
              state.initialBoardObjectsById[boardObjectId].y,
            );

            if (!(pos in acc)) {
              acc[pos] = [];
            }

            acc[pos].push(boardObjectId);
          }
          return acc;
        }, {});

        const highestPos = state.order.find((pos) => pos in boardObjectsIdsByPosition);
        if (highestPos) {
          const validBoardObjects = boardObjectsIdsByPosition[highestPos];
          boardObjectsToBucketsToAtoms = validBoardObjects.reduce(
            (acc, validBoardObject) => ({
              ...acc,
              [validBoardObject]: preOrderBoardObjectsToBucketsToAtoms[validBoardObject],
            }),
            {},
          );
        }
      }

      return {
        ...state,
        ruleRowIndex: action.payload.index,
        boardObjectsToBucketsToAtoms,
      };
    }

    case getType(touch):
      return {
        ...state,
        touchAttempts: [...state.touchAttempts, action.payload.boardObjectId],
      };

    case getType(move): {
      const { dragged, dropped } = action.payload.dropAttempt;

      const matchedAtoms = Array.from(
        state.boardObjectsToBucketsToAtoms?.[dragged]?.[dropped] ?? [],
      );

      if (matchedAtoms.length === 0) {
        return {
          ...state,
          dropAttempts: [...state.dropAttempts, action.payload.dropAttempt],
          lastMoveSuccessful: false,
        };
      }

      const newTotalMoveHistory = [...state.totalMoveHistory, action.payload.dropAttempt];

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
        totalMoveHistory: newTotalMoveHistory,
        lastMoveSuccessful: true,
        paused: true,
        boardObjectsToBucketsToAtoms: Object.values(state.boardObjectsById)
          .filter((boardObject) => boardObject.shape !== Shape.CHECK)
          .reduce(
            (acc, boardObject) => ({
              ...acc,
              [boardObject.id]: {
                ...Object.values(state.atomsByRowIndex[state.ruleRowIndex])
                  .filter(atomMatch(boardObject, state.atomCounts))
                  .reduce<{ [bucket: number]: Set<string> }>(
                    (acc, atom) => {
                      atom.fns
                        .map((fn) =>
                          fn(boardObject.id, newTotalMoveHistory, state.initialBoardObjectsById),
                        )
                        .forEach((bucket) => {
                          if (Number.isNaN(bucket)) {
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
    case getType(completeGame):
      return {
        ...state,
        gameCompleted: true,
      };

    default:
      return state;
  }
};

export default reducer;
