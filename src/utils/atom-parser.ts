import shortid from 'shortid';
import { Atom, AtomFn, BucketPosition, Color, DropAttempt, Shape } from '../@types';

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
  const regex = /\((\d+|\*),(.+),(.+),([\d*]+),(.+)\)/;
  const matches = regex.exec(atom);
  if (matches === null) {
    throw Error(`Invalid atom syntax: ${atom}`);
  }
  const [, matchedCounter, matchedShape, matchedColor, matchedPosition, matchedFn] = matches;

  const counter = matchedCounter === '*' ? Infinity : Number(matchedCounter);

  // Allow * to be represented as NaN
  const position = Number(matchedPosition);

  const errors = [];
  const shape = matchedShape;
  if (!Object.values(Shape).includes(shape)) {
    errors.push(`shape is not supported: ${matchedShape}`);
  }
  const color = matchedColor;
  if (!Object.values(Color).includes(color)) {
    errors.push(`color is not supported: ${matchedColor}`);
  }

  const fn = matchedFn;

  if (errors.length > 0) {
    throw Error(`Bad atom values: ${errors.join('\n')}`);
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

export default parseRow;
