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
import { DEBUG_ENABLED } from '../../constants/env';

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
  numConsecutiveSuccessfulMoves: number;
  currGameId?: string;
  restartIfNotCleared: boolean;
  hasRestarted: boolean;
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
  debugMode: DEBUG_ENABLED && false,
  rawRuleArrayString: undefined,
  gameCompleted: false,
  parsingRuleArray: false,
  error: undefined,
  order: [],
  numConsecutiveSuccessfulMoves: 0,
  currGameId: undefined,
  restartIfNotCleared: false,
  hasRestarted: false,
};

const getBoardObjectsToBucketsToAtoms = (
  index: number,
  totalMoveHistory: DropAttempt[],
  initialBoardObjectsById: {
    [boardObjectId: string]: BoardObjectType;
  },
  boardObjectsById: {
    [boardObjectId: string]: BoardObjectType;
  },
  atomsByRowIndex: { [atomId: string]: Atom }[],
  atomCounts: { [atomId: string]: number },
) =>
  Object.values(boardObjectsById)
    .filter((boardObject) => boardObject.shape !== Shape.CHECK)
    .reduce<{ [boardObjectId: string]: { [bucket: number]: Set<string> } }>(
      (acc, boardObject) => ({
        ...acc,
        [boardObject.id]: {
          ...Object.values(atomsByRowIndex[index])
            .filter(atomMatch(boardObject, atomCounts))
            .reduce<{ [bucket: number]: Set<string> }>(
              (acc, atom) => {
                atom.fns
                  .map((fn) => fn(boardObject.id, totalMoveHistory, initialBoardObjectsById))
                  .forEach((bucket) => {
                    if (Number.isNaN(bucket)) {
                      acc[BucketPosition.TR].add(atom.id);
                      acc[BucketPosition.TL].add(atom.id);
                      acc[BucketPosition.BR].add(atom.id);
                      acc[BucketPosition.BL].add(atom.id);
                    } else if (Number.isFinite(bucket)) {
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
        numConsecutiveSuccessfulMoves: 0,
        currGameId: action.payload.gameId,
        hasRestarted: false,
        restartIfNotCleared: action.payload.restartIfNotCleared,
      };
    }

    case getType(setRuleRowIndex): {
      // Why we need to compute all possible moves:
      // 1. If no possible moves, advance to next rule row or end game.
      // (An epic must detect this and continue to the next rule row then)
      // 2. Hover thingy if possible to drop.
      const preOrderBoardObjectsToBucketsToAtoms = getBoardObjectsToBucketsToAtoms(
        action.payload.index,
        state.totalMoveHistory,
        state.initialBoardObjectsById,
        state.boardObjectsById,
        state.atomsByRowIndex,
        state.atomCounts,
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
        // Going from largest index to 0 indicates a restart
        hasRestarted:
          state.hasRestarted ||
          (state.ruleRowIndex === state.numRuleRows - 1 && action.payload.index === 0),
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
          numConsecutiveSuccessfulMoves: 0,
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
        boardObjectsToBucketsToAtoms: getBoardObjectsToBucketsToAtoms(
          state.ruleRowIndex,
          newTotalMoveHistory,
          state.initialBoardObjectsById,
          state.boardObjectsById,
          state.atomsByRowIndex,
          state.atomCounts,
        ),
        numConsecutiveSuccessfulMoves: state.numConsecutiveSuccessfulMoves + 1,
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
