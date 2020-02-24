import atomParser from '../atom-parser';
import { BoardObjectType, BucketPosition, Color, DropAttempt, Shape } from '../../@types';

it('can parse all atom values', () => {
  const atoms = atomParser('(10,square,*,*,[1,2]) (*,*,green,10,[2,3])');
  expect(atoms).toHaveLength(2);
  const [firstAtom, secondAtom] = atoms;

  expect(firstAtom.counter).toEqual(10);
  expect(secondAtom.counter).toEqual(Infinity);

  expect(firstAtom.shape).toEqual(Shape.SQUARE);
  expect(secondAtom.shape).toEqual(Shape.ANY);

  expect(firstAtom.color).toEqual(Color.ANY);
  expect(secondAtom.color).toEqual(Color.GREEN);

  expect(firstAtom.position).toEqual(NaN);
  expect(secondAtom.position).toEqual(10);

  const totalMoveHistory: DropAttempt[] = [];
  const boardObjects: { [id: number]: BoardObjectType } = {
    1: {
      color: Color.RED,
      id: '1',
      shape: Shape.SQUARE,
      x: 0,
      y: 2,
    },
  };

  expect(firstAtom.fns.map((fn) => fn('1', totalMoveHistory, boardObjects))).toEqual([
    BucketPosition.TR,
    BucketPosition.BR,
  ]);
  expect(secondAtom.fns.map((fn) => fn('1', totalMoveHistory, boardObjects))).toEqual([
    BucketPosition.BR,
    BucketPosition.BL,
  ]);
});

it('can parse * function', () => {
  const atoms = atomParser('(*,*,*,*,*)');
  expect(atoms).toHaveLength(1);
  const [atom] = atoms;

  expect(
    atom.fns.map((fn) =>
      fn('1', [], {
        1: {
          color: Color.RED,
          id: '1',
          shape: Shape.SQUARE,
          x: 0,
          y: 2,
        },
      }),
    ),
  ).toEqual([
    BucketPosition.TL,
    BucketPosition.TR,
    BucketPosition.BR,
    BucketPosition.BL,
  ] as BucketPosition[]);
});

it('can parse p, ps, pc, and pcs', () => {
  const atoms = atomParser('(*,*,*,*,[p,ps,pc,pcs])');
  expect(atoms).toHaveLength(1);
  const atom = atoms[0];

  const boardObjectId = '5';
  const totalMoveHistory: DropAttempt[] = [
    // pcs
    { dragged: '1', dropped: BucketPosition.BL },
    // pc
    { dragged: '2', dropped: BucketPosition.BR },
    // ps
    { dragged: '3', dropped: BucketPosition.TR },
    // p
    { dragged: '4', dropped: BucketPosition.TL },
  ];
  const boardObjects: { [id: number]: BoardObjectType } = {
    // pcs
    1: {
      color: Color.RED,
      id: '1',
      shape: Shape.SQUARE,
      x: 0,
      y: 2,
    },
    // pc
    2: {
      color: Color.RED,
      id: '2',
      shape: Shape.CIRCLE,
      x: 0,
      y: 2,
    },
    // ps
    3: {
      color: Color.GREEN,
      id: '3',
      shape: Shape.SQUARE,
      x: 0,
      y: 2,
    },
    // p
    4: {
      color: Color.GREEN,
      id: '4',
      shape: Shape.STAR,
      x: 0,
      y: 2,
    },
    // test object
    5: {
      color: Color.RED,
      id: '5',
      shape: Shape.SQUARE,
      x: 1,
      y: 2,
    },
  };

  expect(atom.fns.map((fn) => fn(boardObjectId, totalMoveHistory, boardObjects))).toEqual([
    BucketPosition.TL,
    BucketPosition.TR,
    BucketPosition.BR,
    BucketPosition.BL,
  ]);
});

it('can parse modulo functions', () => {
  const atoms = atomParser('(*,*,*,*,[(pc+1)%4])');
  expect(atoms).toHaveLength(1);
  const atom = atoms[0];

  const boardObjectId = '5';
  const totalMoveHistory: DropAttempt[] = [
    // pcs
    { dragged: '1', dropped: BucketPosition.BL },
    // pc
    { dragged: '2', dropped: BucketPosition.BR },
    // ps
    { dragged: '3', dropped: BucketPosition.TR },
    // p
    { dragged: '4', dropped: BucketPosition.TL },
  ];
  const boardObjects: { [id: number]: BoardObjectType } = {
    // pcs
    1: {
      color: Color.RED,
      id: '1',
      shape: Shape.SQUARE,
      x: 0,
      y: 2,
    },
    // pc
    2: {
      color: Color.RED,
      id: '2',
      shape: Shape.CIRCLE,
      x: 0,
      y: 2,
    },
    // ps
    3: {
      color: Color.GREEN,
      id: '3',
      shape: Shape.SQUARE,
      x: 0,
      y: 2,
    },
    // p
    4: {
      color: Color.GREEN,
      id: '4',
      shape: Shape.STAR,
      x: 0,
      y: 2,
    },
    // test object
    5: {
      color: Color.RED,
      id: '5',
      shape: Shape.SQUARE,
      x: 1,
      y: 2,
    },
  };

  expect(atom.fns.map((fn) => fn(boardObjectId, totalMoveHistory, boardObjects))).toEqual([
    BucketPosition.BL,
  ]);
});

it('returns NaNs if history is empty', () => {
  const atoms = atomParser('(*,*,*,*,[(pc+1)%4,p,ps,pcs])');
  expect(atoms).toHaveLength(1);
  const atom = atoms[0];

  const boardObjectId = '1';
  const totalMoveHistory: DropAttempt[] = [];

  const boardObjects: { [id: number]: BoardObjectType } = {
    1: {
      color: Color.RED,
      id: '1',
      shape: Shape.SQUARE,
      x: 0,
      y: 2,
    },
  };

  expect(atom.fns.map((fn) => fn(boardObjectId, totalMoveHistory, boardObjects))).toEqual([
    NaN,
    NaN,
    NaN,
    NaN,
  ]);
});
