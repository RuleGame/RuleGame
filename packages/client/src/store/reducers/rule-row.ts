import keyBy from 'lodash/keyBy';
import { getType } from 'typesafe-actions';
import {
  BoardObjectId,
  BoardObjectType,
  BucketPosition,
  DropAttempt,
  RuleArray,
  RuleRow,
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
  ruleRowsCompleted: number;
  ruleArray?: RuleArray;
  // One element per rule row.
  ruleArrayInfos: { successfulMoves: number }[];
  validPositionsByAtom: { [atomId: string]: Set<number> };
  checkedObjects: Set<string>;
};

export const initialState: State = {
  atomCounts: {},
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
  ruleRowsCompleted: 0,
  ruleArray: undefined,
  ruleArrayInfos: [],
  validPositionsByAtom: {},
  checkedObjects: new Set(),
};

const getBoardObjectsToBucketsToAtoms = (
  totalMoveHistory: DropAttempt[],
  initialBoardObjectsById: {
    [boardObjectId: string]: BoardObjectType;
  },
  boardObjectsById: {
    [boardObjectId: string]: BoardObjectType;
  },
  atomCounts: { [atomId: string]: number },
  ruleRow: RuleRow,
  checkedObjects: Set<string>,
) =>
  Object.values(boardObjectsById)
    // .filter((boardObject) => validPositions.has(xYToPosition(boardObject.x, boardObject.y)))
    .filter((boardObject) => !checkedObjects.has(boardObject.id))
    .reduce<{ [boardObjectId: string]: { [bucket: number]: Set<string> } }>(
      (acc, boardObject) => ({
        ...acc,
        [boardObject.id]: {
          ...ruleRow
            .filter(atomMatch(boardObject, atomCounts))
            .filter((atom) => {
              if (atom.position === undefined) {
                // Defaults to allowed (*) if not defined
                return true;
              }
              if (typeof atom.position === 'number') {
                return atom.position === xYToPosition(boardObject.x, boardObject.y);
              }
              // Defaults to allowed (*) if not defined
              return (
                atom
                  .position(boardObject.id, totalMoveHistory, boardObjectsById, checkedObjects)
                  ?.has(xYToPosition(boardObject.x, boardObject.y)) ?? true
              );
            })
            .reduce<{ [bucket: number]: Set<string> }>(
              (acc, atom) => {
                atom.fns
                  .map((fn) => fn(boardObject.id, totalMoveHistory, initialBoardObjectsById))
                  .map((temp) => (temp instanceof Set ? Array.from(temp.values()) : [temp]))
                  .flat()
                  .forEach((bucket) => {
                    if (Number.isFinite(bucket)) {
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
        boardObjectsToBucketsToAtoms: {},
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
        restartIfNotCleared: action.payload.restartIfNotCleared,
        ruleRowsCompleted: 0,
        ruleArray: action.payload.ruleArray,
        ruleArrayInfos: action.payload.ruleArray.map(() => ({
          successfulMoves: 0,
        })),
        checkedObjects: new Set(),
      };
    }

    case getType(setRuleRowIndex): {
      const atomCounts = state.ruleArray![action.payload.index].reduce(
        (acc, atom) => ({
          ...acc,
          [atom.id]: atom.counter,
        }),
        {},
      );

      // Why we need to compute all possible moves:
      // 1. If no possible moves, advance to next rule row or end game.
      // (An epic must detect this and continue to the next rule row then)
      // 2. Hover thingy if possible to drop.
      const preOrderBoardObjectsToBucketsToAtoms = getBoardObjectsToBucketsToAtoms(
        state.totalMoveHistory,
        state.initialBoardObjectsById,
        state.boardObjectsById,
        atomCounts,
        state.ruleArray![action.payload.index],
        state.checkedObjects,
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
        atomCounts,
        ruleRowIndex: action.payload.index,
        boardObjectsToBucketsToAtoms,
        ruleRowsCompleted: state.ruleRowsCompleted + 1,
        ruleArrayInfos: state.ruleArrayInfos.map((ruleArrayInfo, i) =>
          i !== action.payload.index ? ruleArrayInfo : { ...ruleArrayInfo, successfulMoves: 0 },
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

      const matchedAtoms = Array.from(
        state.boardObjectsToBucketsToAtoms?.[dragged]?.[dropped] ?? [],
      );

      if (matchedAtoms.length === 0) {
        // Made an incorrect move
        return {
          ...state,
          dropAttempts: [
            ...state.dropAttempts,
            { ...action.payload.dropAttempt, successful: false },
          ],
          lastMoveSuccessful: false,
          paused: true,
          numConsecutiveSuccessfulMoves: 0,
        };
      }

      const newTotalMoveHistory = [...state.totalMoveHistory, action.payload.dropAttempt];
      const newAtomCounts = matchedAtoms.reduce(
        (acc, atomId) => ({
          ...acc,
          [atomId]: state.atomCounts[atomId] - 1,
        }),
        state.atomCounts,
      );
      return {
        ...state,
        atomCounts: newAtomCounts,
        checkedObjects: new Set(state.checkedObjects.add(dragged)),
        dropAttempts: [...state.dropAttempts, { ...action.payload.dropAttempt, successful: true }],
        totalMoveHistory: newTotalMoveHistory,
        lastMoveSuccessful: true,
        paused: true,
        // boardObjectsToBucketsToAtoms,
        numConsecutiveSuccessfulMoves: state.numConsecutiveSuccessfulMoves + 1,
        ruleArrayInfos: state.ruleArrayInfos.map((ruleArrayInfo, i) =>
          i !== state.ruleRowIndex
            ? ruleArrayInfo
            : {
                ...ruleArrayInfo,
                successfulMoves: state.ruleArrayInfos[state.ruleRowIndex].successfulMoves + 1,
              },
        ),
      };
    }

    case getType(removeBoardObject): {
      // 1. If no possible moves, advance to next rule row or end game.
      // (An epic must detect this and continue to the next rule row then)
      // 2. Hover thingy if possible to drop.
      const preOrderBoardObjectsToBucketsToAtoms = getBoardObjectsToBucketsToAtoms(
        state.totalMoveHistory,
        state.initialBoardObjectsById,
        state.boardObjectsById,
        state.atomCounts,
        state.ruleArray![state.ruleRowIndex],
        state.checkedObjects,
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
        boardObjectsToBucketsToAtoms,
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
