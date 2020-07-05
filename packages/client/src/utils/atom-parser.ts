import shortid from 'shortid';
import range from 'lodash/range';
import {
  Atom,
  AtomFn,
  BoardObjectType,
  BucketPosition,
  Color,
  PositionsFn,
  Shape,
  VALID_SHAPES,
} from '../@types';
import { cols, rows } from '../constants';
import { xYToPosition } from './atom-match';

const parseAtomRawFnString = (rawAtomFnString: string): AtomFn[] => {
  // Drop in any bucket position if *
  if (rawAtomFnString === '*') {
    // Assuming BucketPosition is numbered from 0 to 3.
    return [
      BucketPosition.BL,
      BucketPosition.BR,
      BucketPosition.TR,
      BucketPosition.TL,
    ].map((bucket) => () => bucket);
  }

  const regex = /^\[(.+)]$/;
  const fnsRawStrings = rawAtomFnString.match(regex);
  if (!fnsRawStrings || fnsRawStrings.length !== 2) {
    throw Error(`Bad function value: ${rawAtomFnString}`);
  }
  const fnStrings = fnsRawStrings[1].split(',');

  const p: AtomFn = (boardObjectId, totalMoveHistory) => {
    const reversedTotalMoveHistory = [...totalMoveHistory].reverse();

    const mostRecent = reversedTotalMoveHistory.find(() => true);
    return mostRecent?.dropped ?? NaN;
  };

  const pc: AtomFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const reversedTotalMoveHistory = [...totalMoveHistory].reverse();

    const mostRecent = reversedTotalMoveHistory.find(
      (dropAttempt) =>
        boardObjects[dropAttempt.dragged].color === boardObjects[boardObjectId].color,
    );
    return mostRecent?.dropped ?? NaN;
  };

  const pcs: AtomFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const reversedTotalMoveHistory = [...totalMoveHistory].reverse();

    const mostRecent = reversedTotalMoveHistory.find(
      (dropAttempt) =>
        boardObjects[dropAttempt.dragged].color === boardObjects[boardObjectId].color &&
        boardObjects[dropAttempt.dragged].shape === boardObjects[boardObjectId].shape,
    );
    return mostRecent?.dropped ?? NaN;
  };

  const ps: AtomFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const reversedTotalMoveHistory = [...totalMoveHistory].reverse();

    const mostRecent = reversedTotalMoveHistory.find(
      (dropAttempt) =>
        boardObjects[dropAttempt.dragged].shape === boardObjects[boardObjectId].shape,
    );
    return mostRecent?.dropped ?? NaN;
  };

  const nearby: AtomFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const { x, y } = boardObjects[boardObjectId];
    // Normalize x and y to index by 0
    const nX = x;
    const nY = y;
    const validBuckets = new Set<BucketPosition>();
    if (nX < cols / 2 && nY < rows / 2) {
      validBuckets.add(BucketPosition.BL);
      // Use floor to include objects in the middle too
      // when considering top and right sides buckets
    }
    if (nX < cols / 2 && nY >= Math.floor(rows / 2)) {
      validBuckets.add(BucketPosition.TL);
    }
    if (nX >= Math.floor(cols / 2) && nY < rows / 2) {
      validBuckets.add(BucketPosition.BR);
    }
    if (nX >= Math.floor(cols / 2) && nY >= Math.floor(rows / 2)) {
      validBuckets.add(BucketPosition.TR);
    }

    return validBuckets;
  };

  const remotest: AtomFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const { x, y } = boardObjects[boardObjectId];
    // Normalize x and y to index by 0
    const nX = x;
    const nY = y;
    const validBuckets = new Set<BucketPosition>();
    if (nX < cols / 2 && nY < rows / 2) {
      validBuckets.add(BucketPosition.TR);
      // Use floor to include objects in the middle too
      // when considering top and right sides buckets
    }
    if (nX < cols / 2 && nY >= Math.floor(rows / 2)) {
      validBuckets.add(BucketPosition.BR);
    }
    if (nX >= Math.floor(cols / 2) && nY < rows / 2) {
      validBuckets.add(BucketPosition.TL);
    }
    if (nX >= Math.floor(cols / 2) && nY >= Math.floor(rows / 2)) {
      validBuckets.add(BucketPosition.BL);
    }

    return validBuckets;
  };

  return fnStrings.map((fnString) => {
    const evalFn: AtomFn = (boardObjectId, totalMoveHistory, boardObjects) =>
      // eslint-disable-next-line no-eval
      eval(`(p, pcs, pc, ps, Nearby, Remotest) => ${fnString}`)(
        ...([p, pcs, pc, ps, nearby, remotest] as const).map((fn) =>
          fn(boardObjectId, totalMoveHistory, boardObjects),
        ),
      );
    return evalFn;
  });
};

const parseAtomString = (atom: string): Atom => {
  const regex = /\((\d+|\*),(.+),(.+),(.+),(\*|\[.*])\)/;
  const matches = regex.exec(atom);
  if (matches === null) {
    throw Error(
      `Invalid atom syntax: ${atom}\n\nFYI:\nCorrect Syntax: (counter,shape,color,position,[bucketFunction1,...])\nCorrect example: (10,*,green,10,[2,(pc+1)%4])\n\nRemember, spaces are only used for separating multiple atoms in the same row.\nExample:\n(10,square,*,*,[1,2]) (10,*,green,10,[2,3])`,
    );
  }
  const [, matchedCounter, matchedShape, matchedColor, matchedPosition, matchedFn] = matches;

  const counter = matchedCounter === '*' ? Infinity : Number(matchedCounter);

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

  const farthestPositions: PositionsFn = (boardObjectId, totalMoveHistory, boardObjects) => {
    const computeDistance = (x: number, y: number, boardObject: BoardObjectType) => {
      return Math.sqrt((x - boardObject.x) ** 2 + (y - boardObject.y) ** 2);
    };

    const { farthestPositions } = Object.values(boardObjects)
      .filter((boardObject) => boardObject.shape !== Shape.CHECK)
      .reduce<{
        farthestDistance: number;
        farthestPositions: Set<number>;
      }>(
        ({ farthestDistance, farthestPositions }, boardObject) => {
          const nearestBucketDistance = Math.min(
            ...[
              [0, 0],
              [0, rows - 1],
              [cols - 1, 0],
              [cols - 1, rows - 1],
            ].map(([x, y]) => computeDistance(x, y, boardObject)),
          );

          if (nearestBucketDistance > farthestDistance) {
            farthestPositions.clear();
          }

          if (nearestBucketDistance >= farthestDistance) {
            farthestPositions.add(xYToPosition(boardObject.x, boardObject.y));
            farthestDistance = nearestBucketDistance;
          }

          return { farthestDistance, farthestPositions };
        },
        { farthestDistance: -Infinity, farthestPositions: new Set() },
      );

    return farthestPositions;
  };

  const position: Atom['position'] =
    matchedPosition !== '*'
      ? // eslint-disable-next-line no-eval
        (eval(`(L, R, T, B, Farthest) => ${matchedPosition}`)(
          leftPositions,
          rightPositions,
          topPositions,
          bottomPositions,
          farthestPositions,
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
