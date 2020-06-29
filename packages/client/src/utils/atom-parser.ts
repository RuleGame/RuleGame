import shortid from 'shortid';
import range from 'lodash/range';
import {
  Atom,
  AtomFn,
  BucketPosition,
  Color,
  DropAttempt,
  PositionsFn,
  Shape,
  VALID_SHAPES,
} from '../@types';
import { cols, rows } from '../constants';
import { xYToPosition } from './atom-match';

type RawAtomFn = (
  p: BucketPosition | undefined,
  pcs: BucketPosition | undefined,
  pc: BucketPosition | undefined,
  ps: BucketPosition | undefined,
) => number;

// TODO: Add reselect to cache args and return value
const convertRawAtomFnToAtomFn = (rawAtomFn: RawAtomFn): AtomFn => (
  boardObjectId,
  totalMoveHistory,
  boardObjects,
) => {
  const reversedTotalMoveHistory = [...totalMoveHistory].reverse();

  /**
   * Returns most recent dropped bucket id according to predicate
   * else undefined if no match
   * @param predicate
   */
  const findMostRecentId = (
    predicate: (dropAttempt: DropAttempt) => boolean,
  ): BucketPosition | undefined => {
    const mostRecent = reversedTotalMoveHistory.find(predicate);
    return mostRecent !== undefined ? mostRecent.dropped : undefined;
  };

  // TODO: Optimize this later
  return rawAtomFn(
    findMostRecentId(() => true),
    findMostRecentId(
      (dropAttempt) =>
        boardObjects[dropAttempt.dragged].color === boardObjects[boardObjectId].color &&
        boardObjects[dropAttempt.dragged].shape === boardObjects[boardObjectId].shape,
    ),
    findMostRecentId(
      (dropAttempt) =>
        boardObjects[dropAttempt.dragged].color === boardObjects[boardObjectId].color,
    ),
    findMostRecentId(
      (dropAttempt) =>
        boardObjects[dropAttempt.dragged].shape === boardObjects[boardObjectId].shape,
    ),
  );
};

const parseAtomRawFnString = (rawAtomFnString: string): AtomFn[] => {
  // Drop in any bucket position if *
  if (rawAtomFnString === '*') {
    // Assuming BucketPosition is numbered from 0 to 3.
    return [0, 1, 2, 3].map((bucketPosition) => () => bucketPosition);
  }

  const regex = /^\[(.+)]$/;
  const fnsRawStrings = rawAtomFnString.match(regex);
  if (!fnsRawStrings || fnsRawStrings.length !== 2) {
    throw Error(`Bad function value: ${rawAtomFnString}`);
  }
  const fnStrings = fnsRawStrings[1].split(',');
  return fnStrings.map((fnString) => {
    // eslint-disable-next-line no-eval
    const evalFn: RawAtomFn = eval(`(p=NaN, pcs=NaN, pc=NaN, ps=NaN) => ${fnString}`);
    return convertRawAtomFnToAtomFn(evalFn);
  });
};

const parseAtomString = (atom: string): Atom => {
  const regex = /\((\d+|\*),(.+),(.+),(\d+|[*TBLR]),(\*|\[.*])\)/;
  const matches = regex.exec(atom);
  if (matches === null) {
    throw Error(
      `Invalid atom syntax: ${atom}\n\nFYI:\nCorrect Syntax: (counter,shape,color,position,[bucketFunction1,...])\nCorrect example: (10,*,green,10,[2,(pc+1)%4])\n\nRemember, spaces are only used for separating multiple atoms in the same row.\nExample:\n(10,square,*,*,[1,2]) (10,*,green,10,[2,3])`,
    );
  }
  const [, matchedCounter, matchedShape, matchedColor, matchedPosition, matchedFn] = matches;

  const counter = matchedCounter === '*' ? Infinity : Number(matchedCounter);

  // const leftPositions = range(rows - 2).map((i) => (cols - 2) * i + 1);
  // const rightPositions = range(rows - 2).map((i) => (cols - 2) * i + cols - 2);
  // const topPositions = range(1, cols - 1).map((i) => i + (rows - 3) * (cols - 2));
  // const bottomPositions = range(1, cols - 1);

  const bottomPositions: PositionsFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const minY = Object.values(boardObjects)
      .filter((boardObject) => boardObject.shape !== Shape.CHECK)
      .reduce<number | undefined>((acc, boardObject) => {
        return Math.min(boardObject.y, acc ?? Infinity);
      }, undefined);

    // Allow all buckets by returning undefined if minY undefined (not found)
    return minY === undefined
      ? undefined
      : new Set(range(1, cols - 1).map((x) => xYToPosition(x, minY)));
  };

  const topPositions: PositionsFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const minY = Object.values(boardObjects)
      .filter((boardObject) => boardObject.shape !== Shape.CHECK)
      .reduce<number | undefined>((acc, boardObject) => {
        return Math.max(boardObject.y, acc ?? -Infinity);
      }, undefined);

    // Allow all buckets by returning undefined if minY undefined (not found)
    return minY === undefined
      ? undefined
      : new Set(range(1, cols - 1).map((x) => xYToPosition(x, minY)));
  };

  const leftPositions: PositionsFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const minX = Object.values(boardObjects)
      .filter((boardObject) => boardObject.shape !== Shape.CHECK)
      .reduce<number | undefined>((acc, boardObject) => {
        return Math.min(boardObject.x, acc ?? Infinity);
      }, undefined);

    // Allow all buckets by returning undefined if minY undefined (not found)
    return minX === undefined
      ? undefined
      : new Set(range(1, rows - 1).map((y) => xYToPosition(minX, y)));
  };

  const rightPositions: PositionsFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const minX = Object.values(boardObjects)
      .filter((boardObject) => boardObject.shape !== Shape.CHECK)
      .reduce<number | undefined>((acc, boardObject) => {
        return Math.max(boardObject.x, acc ?? -Infinity);
      }, undefined);

    // Allow all buckets by returning undefined if minY undefined (not found)
    return minX === undefined
      ? undefined
      : new Set(range(1, rows - 1).map((y) => xYToPosition(minX, y)));
  };

  const position: Atom['position'] =
    matchedPosition !== '*'
      ? // eslint-disable-next-line no-eval
        (eval(`(L, R, T, B) => ${matchedPosition}`)(
          leftPositions,
          rightPositions,
          topPositions,
          bottomPositions,
        ) as PositionsFn | number)
      : undefined;

  const errors = [];
  const shape = matchedShape;
  const validShapes = Object.values(Shape).filter((shape) => VALID_SHAPES.has(shape));
  if (!validShapes.includes(shape as Shape)) {
    errors.push(
      `"${matchedShape}" is not a valid shape.\n\nSupported shapes: ${validShapes.join(
        ', ',
      )}\nSyntax: (counter,shape,color,[bucketFunction1,...])`,
    );
  }
  const color = matchedColor;
  if (!Object.values(Color).includes(color as Color)) {
    errors.push(
      `"${matchedColor}" is not a valid color.\n\nSupported colors: ${Object.values(Color).join(
        ', ',
      )}\nSyntax: (counter,shape,color,[bucketFunction1,...])`,
    );
  }

  // const fnWhitelist = /[pcs,*[\]+\-%]/;
  // if (!fnWhitelist.test(matchedFn)) {
  //   errors.push(
  //     `"${matchedFn}" contains invalid characters.\n\nSupported colors: ${Object.values(Color).join(
  //       ', ',
  //     )}\nSyntax: (counter,shape,color,[bucketFunction1,...])`,
  //   );
  // }

  const fn = matchedFn;

  if (errors.length > 0) {
    throw Error(`Invalid atom: ${atom}\n\nDetails:\n ${errors.join('\n\n')}`);
  }

  return {
    id: shortid.generate(),
    counter,
    shape: shape as Shape,
    position,
    color: color as Color,
    fns: parseAtomRawFnString(fn),
  };
};

const parseRow = (row: string): Atom[] => {
  return row.split(' ').map(parseAtomString);
};

export const parseRuleArray = (rawRuleArray: string) => rawRuleArray.split('\n').map(parseRow);

export default parseRow;
