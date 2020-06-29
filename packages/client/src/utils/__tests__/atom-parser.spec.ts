import atomParser from '../atom-parser';
import {
  BoardObjectType,
  BucketPosition,
  Color,
  DropAttempt,
  PositionsFn,
  Shape,
} from '../../@types';

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

  expect(firstAtom.position).toBeUndefined();
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

it('returns NaNs for a bucket function if its inputs are not to be found in the history but still matches static conditions like shape and color', () => {
  const atoms = atomParser('(*,*,*,*,[(pc+1)%4,p,ps,pcs])');
  expect(atoms).toHaveLength(1);
  const atom = atoms[0];

  const boardObjectId = '1';
  const totalMoveHistory: DropAttempt[] = [
    {
      dragged: '0',
      dropped: BucketPosition.BR,
    },
  ];

  const boardObjects: { [id: number]: BoardObjectType } = {
    0: {
      color: Color.BLUE,
      id: '1',
      shape: Shape.CIRCLE,
      x: 1,
      y: 2,
    },
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
    BucketPosition.BR,
    NaN,
    NaN,
  ]);
});

it('works for [1,2,3] bucket functions', () => {
  const atoms = atomParser('(*,*,*,*,[1,2,3])');
  expect(atoms).toHaveLength(1);
  const atom = atoms[0];

  const boardObjectId = '1';
  const totalMoveHistory: DropAttempt[] = [
    {
      dragged: '0',
      dropped: BucketPosition.BR,
    },
  ];

  const boardObjects: { [id: number]: BoardObjectType } = {
    0: {
      color: Color.BLUE,
      id: '1',
      shape: Shape.CIRCLE,
      x: 1,
      y: 2,
    },
    1: {
      color: Color.RED,
      id: '1',
      shape: Shape.SQUARE,
      x: 0,
      y: 2,
    },
  };

  expect(atom.fns.map((fn) => fn(boardObjectId, totalMoveHistory, boardObjects))).toEqual([
    1,
    2,
    3,
  ]);
});

describe('B positions function', () => {
  it('allows most bottom positions', () => {
    const atoms = atomParser('(*,*,*,B,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      // Checks (dropped objects) should be ignored
      0: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 1,
      },
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CIRCLE,
        x: 1,
        y: 1,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.SQUARE,
        x: 1,
        y: 2,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toEqual(
      new Set<number>([1, 2, 3, 4, 5, 6]),
    );
  });

  it('allows second most bottom positions', () => {
    const atoms = atomParser('(*,*,*,B,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      // Checks (dropped objects) should be ignored
      0: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 1,
      },
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CIRCLE,
        x: 1,
        y: 2,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.SQUARE,
        x: 1,
        y: 3,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toEqual(
      new Set<number>([7, 8, 9, 10, 11, 12]),
    );
  });

  it('undefined with no board objects', () => {
    const atoms = atomParser('(*,*,*,B,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 2,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.CHECK,
        x: 1,
        y: 3,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toBeUndefined();
  });
});

describe('T positions function', () => {
  it('allows most top positions', () => {
    const atoms = atomParser('(*,*,*,T,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      // Checks (dropped objects) should be ignored
      0: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 6,
      },
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CIRCLE,
        x: 1,
        y: 6,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.SQUARE,
        x: 1,
        y: 5,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toEqual(
      new Set<number>([31, 32, 33, 34, 35, 36]),
    );
  });

  it('allows second most top positions', () => {
    const atoms = atomParser('(*,*,*,T,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      // Checks (dropped objects) should be ignored
      0: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 6,
      },
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CIRCLE,
        x: 1,
        y: 5,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.SQUARE,
        x: 1,
        y: 4,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toEqual(
      new Set<number>([25, 26, 27, 28, 29, 30]),
    );
  });

  it('undefined with no board objects', () => {
    const atoms = atomParser('(*,*,*,T,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 2,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.CHECK,
        x: 1,
        y: 3,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toBeUndefined();
  });
});

describe('L positions function', () => {
  it('allows most left positions', () => {
    const atoms = atomParser('(*,*,*,L,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      // Checks (dropped objects) should be ignored
      0: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 6,
      },
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CIRCLE,
        x: 1,
        y: 6,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.SQUARE,
        x: 2,
        y: 5,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toEqual(
      new Set<number>([1, 7, 13, 19, 25, 31]),
    );
  });

  it('allows second most left positions', () => {
    const atoms = atomParser('(*,*,*,L,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      // Checks (dropped objects) should be ignored
      0: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 6,
      },
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CIRCLE,
        x: 2,
        y: 5,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.SQUARE,
        x: 3,
        y: 4,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toEqual(
      new Set<number>([2, 8, 14, 20, 26, 32]),
    );
  });

  it('undefined with no board objects', () => {
    const atoms = atomParser('(*,*,*,L,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 2,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.CHECK,
        x: 1,
        y: 3,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toBeUndefined();
  });
});

describe('R positions function', () => {
  it('allows most right positions', () => {
    const atoms = atomParser('(*,*,*,R,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      // Checks (dropped objects) should be ignored
      0: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 6,
        y: 6,
      },
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CIRCLE,
        x: 6,
        y: 6,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.SQUARE,
        x: 5,
        y: 5,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toEqual(
      new Set<number>([6, 12, 18, 24, 30, 36]),
    );
  });

  it('allows second most right positions', () => {
    const atoms = atomParser('(*,*,*,R,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      // Checks (dropped objects) should be ignored
      0: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 6,
        y: 6,
      },
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CIRCLE,
        x: 5,
        y: 5,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.SQUARE,
        x: 4,
        y: 4,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toEqual(
      new Set<number>([5, 11, 17, 23, 29, 35]),
    );
  });

  it('undefined with no board objects', () => {
    const atoms = atomParser('(*,*,*,R,[0])');
    expect(atoms).toHaveLength(1);
    const atom = atoms[0];

    const boardObjects: { [id: number]: BoardObjectType } = {
      1: {
        color: Color.BLUE,
        id: '1',
        shape: Shape.CHECK,
        x: 1,
        y: 2,
      },
      2: {
        color: Color.RED,
        id: '2',
        shape: Shape.CHECK,
        x: 1,
        y: 3,
      },
    };

    const totalMoveHistory: DropAttempt[] = [];

    expect((atom.position as PositionsFn)('1', totalMoveHistory, boardObjects)).toBeUndefined();
  });
});
