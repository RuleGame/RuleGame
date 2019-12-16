import { loadRuleArraySuccess, setRuleRowIndex } from '../../actions/rule-row';
import reducer, { initialState, State } from '../rule-row';
import { BucketPosition, Color, Shape } from '../../../@types';

describe(`loadRuleArraySuccess`, () => {
  it('returns empty fields on empty action', () => {
    const action = loadRuleArraySuccess([], []);
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      atomCounts: {},
      atomsByRowIndex: [],
      boardObjectsById: {},
      ruleRowIndex: NaN,
      numRuleRows: 0,
    } as State);
  });

  it('sets fields correctly', () => {
    const atomFns1 = [() => BucketPosition.BR, () => BucketPosition.TR];
    const atomFns2 = [() => BucketPosition.TL];
    const action = loadRuleArraySuccess(
      [
        {
          color: Color.RED,
          id: '1',
          shape: Shape.SQUARE,
          x: 0,
          y: 2,
        },
        {
          color: Color.RED,
          id: '2',
          shape: Shape.CIRCLE,
          x: 0,
          y: 2,
        },
        {
          color: Color.GREEN,
          id: '3',
          shape: Shape.SQUARE,
          x: 0,
          y: 2,
        },
        {
          color: Color.GREEN,
          id: '4',
          shape: Shape.STAR,
          x: 0,
          y: 2,
        },
        {
          color: Color.RED,
          id: '5',
          shape: Shape.SQUARE,
          x: 1,
          y: 2,
        },
      ],
      [
        [
          {
            id: '1',
            color: Color.ANY,
            counter: 2,
            fns: atomFns1,
            position: BucketPosition.TR,
            shape: Shape.STAR,
          },
          {
            id: '2',
            color: Color.BLACK,
            counter: 3,
            fns: atomFns2,
            position: BucketPosition.BL,
            shape: Shape.SQUARE,
          },
        ],
        [
          {
            id: '3',
            color: Color.RED,
            counter: 4,
            fns: atomFns2,
            position: BucketPosition.BR,
            shape: Shape.CIRCLE,
          },
          {
            id: '4',
            color: Color.GREEN,
            counter: 5,
            fns: atomFns1,
            position: BucketPosition.TR,
            shape: Shape.TRIANGLE,
          },
        ],
      ],
    );

    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      atomCounts: {
        1: 2,
        2: 3,
        3: 4,
        4: 5,
      },
      atomsByRowIndex: [
        {
          1: {
            id: '1',
            color: Color.ANY,
            counter: 2,
            fns: atomFns1,
            position: BucketPosition.TR,
            shape: Shape.STAR,
          },
          2: {
            id: '2',
            color: Color.BLACK,
            counter: 3,
            fns: atomFns2,
            position: BucketPosition.BL,
            shape: Shape.SQUARE,
          },
        },
        {
          3: {
            id: '3',
            color: Color.RED,
            counter: 4,
            fns: atomFns2,
            position: BucketPosition.BR,
            shape: Shape.CIRCLE,
          },
          4: {
            id: '4',
            color: Color.GREEN,
            counter: 5,
            fns: atomFns1,
            position: BucketPosition.TR,
            shape: Shape.TRIANGLE,
          },
        },
      ],
      boardObjectsById: {
        1: {
          color: Color.RED,
          id: '1',
          shape: Shape.SQUARE,
          x: 0,
          y: 2,
        },
        2: {
          color: Color.RED,
          id: '2',
          shape: Shape.CIRCLE,
          x: 0,
          y: 2,
        },
        3: {
          color: Color.GREEN,
          id: '3',
          shape: Shape.SQUARE,
          x: 0,
          y: 2,
        },
        4: {
          color: Color.GREEN,
          id: '4',
          shape: Shape.STAR,
          x: 0,
          y: 2,
        },
        5: {
          color: Color.RED,
          id: '5',
          shape: Shape.SQUARE,
          x: 1,
          y: 2,
        },
      },
      initialBoardObjectsById: {
        '1': {
          color: 'red',
          id: '1',
          shape: 'square',
          x: 0,
          y: 2,
        },
        '2': {
          color: 'red',
          id: '2',
          shape: 'circle',
          x: 0,
          y: 2,
        },
        '3': {
          color: 'green',
          id: '3',
          shape: 'square',
          x: 0,
          y: 2,
        },
        '4': {
          color: 'green',
          id: '4',
          shape: 'star',
          x: 0,
          y: 2,
        },
        '5': {
          color: 'red',
          id: '5',
          shape: 'square',
          x: 1,
          y: 2,
        },
      },
      ruleRowIndex: NaN,
      numRuleRows: 2,
    } as State);
  });
});

describe(`setRuleRowIndex`, () => {
  it('defaults to empty on index out of bounds', () => {
    const action = setRuleRowIndex(1);

    expect(reducer({ ...initialState, atomsByRowIndex: [{}] }, action)).toEqual({
      ...initialState,
      atomsByRowIndex: [{}],
      ruleRowIndex: 1,
      boardObjectsToBucketsToAtoms: {},
    } as State);
  });

  /**
   * Not necessessary to exhaustively
   * check for matching atom attributes other than its function return value.
   * The atom match tests test for matches and atom-parser tests with the functions' args.
   */
  it('sets fields correctly', () => {
    const action = setRuleRowIndex(1);
    const atomFns1 = [() => BucketPosition.BL, () => BucketPosition.BR, () => BucketPosition.TL];
    const atomFns2 = [() => BucketPosition.TL, () => BucketPosition.TR, () => BucketPosition.BL];

    expect(
      reducer(
        {
          ...initialState,
          atomCounts: {
            1: 2,
            2: 2,
            3: 0,
          },
          atomsByRowIndex: [
            {},
            {
              1: {
                color: Color.ANY,
                id: '1',
                counter: 2,
                position: NaN,
                fns: atomFns1,
                shape: Shape.CIRCLE,
              },
              2: {
                color: Color.RED,
                id: '2',
                counter: 2,
                position: NaN,
                fns: atomFns2,
                shape: Shape.ANY,
              },
              3: {
                color: Color.ANY,
                id: '3',
                counter: 2,
                position: NaN,
                fns: atomFns2,
                shape: Shape.ANY,
              },
            },
          ],
          boardObjectsById: {
            1: {
              color: Color.RED,
              id: '1',
              shape: Shape.SQUARE,
              x: 0,
              y: 2,
            },
            2: {
              color: Color.RED,
              id: '2',
              shape: Shape.CIRCLE,
              x: 0,
              y: 2,
            },
            3: {
              color: Color.GREEN,
              id: '3',
              shape: Shape.SQUARE,
              x: 0,
              y: 2,
            },
            4: {
              color: Color.GREEN,
              id: '4',
              shape: Shape.STAR,
              x: 0,
              y: 2,
            },
            5: {
              color: Color.BLUE,
              id: '5',
              shape: Shape.CIRCLE,
              x: 1,
              y: 2,
            },
          },
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      atomCounts: {
        1: 2,
        2: 2,
        3: 0,
      },
      atomsByRowIndex: [
        {},
        {
          1: {
            color: Color.ANY,
            id: '1',
            counter: 2,
            position: NaN,
            fns: atomFns1,
            shape: Shape.CIRCLE,
          },
          2: {
            color: Color.RED,
            id: '2',
            counter: 2,
            position: NaN,
            fns: atomFns2,
            shape: Shape.ANY,
          },
          3: {
            color: Color.ANY,
            id: '3',
            counter: 2,
            position: NaN,
            fns: atomFns2,
            shape: Shape.ANY,
          },
        },
      ],
      boardObjectsById: {
        1: {
          color: Color.RED,
          id: '1',
          shape: Shape.SQUARE,
          x: 0,
          y: 2,
        },
        2: {
          color: Color.RED,
          id: '2',
          shape: Shape.CIRCLE,
          x: 0,
          y: 2,
        },
        3: {
          color: Color.GREEN,
          id: '3',
          shape: Shape.SQUARE,
          x: 0,
          y: 2,
        },
        4: {
          color: Color.GREEN,
          id: '4',
          shape: Shape.STAR,
          x: 0,
          y: 2,
        },
        5: {
          color: Color.BLUE,
          id: '5',
          shape: Shape.CIRCLE,
          x: 1,
          y: 2,
        },
      },
      ruleRowIndex: 1,
      boardObjectsToBucketsToAtoms: {
        1: {
          [BucketPosition.TR]: new Set(['2']),
          [BucketPosition.TL]: new Set(['2']),
          [BucketPosition.BR]: new Set([]),
          [BucketPosition.BL]: new Set(['2']),
        },
        2: {
          [BucketPosition.TR]: new Set(['2']),
          [BucketPosition.TL]: new Set(['2', '1']),
          [BucketPosition.BR]: new Set(['1']),
          [BucketPosition.BL]: new Set(['2', '1']),
        },
        3: {
          [BucketPosition.TR]: new Set([]),
          [BucketPosition.TL]: new Set([]),
          [BucketPosition.BR]: new Set([]),
          [BucketPosition.BL]: new Set([]),
        },
        4: {
          [BucketPosition.TR]: new Set([]),
          [BucketPosition.TL]: new Set([]),
          [BucketPosition.BR]: new Set([]),
          [BucketPosition.BL]: new Set([]),
        },
        5: {
          [BucketPosition.TR]: new Set([]),
          [BucketPosition.TL]: new Set(['1']),
          [BucketPosition.BR]: new Set(['1']),
          [BucketPosition.BL]: new Set(['1']),
        },
      },
    } as State);
  });

  it('returns all buckets if history is empty', () => {
    const action = setRuleRowIndex(1);
    const atomFns1 = [() => BucketPosition.TL];
    const atomFns2 = [() => NaN, () => BucketPosition.BL];

    expect(
      reducer(
        {
          ...initialState,
          atomCounts: {
            1: 2,
            2: 3,
          },
          atomsByRowIndex: [
            {},
            {
              1: {
                color: Color.ANY,
                id: '1',
                counter: 2,
                position: NaN,
                fns: atomFns1,
                shape: Shape.CIRCLE,
              },
              2: {
                color: Color.RED,
                id: '2',
                counter: 2,
                position: NaN,
                fns: atomFns2,
                shape: Shape.ANY,
              },
            },
          ],
          boardObjectsById: {
            1: {
              color: Color.RED,
              id: '1',
              shape: Shape.CIRCLE,
              x: 0,
              y: 2,
            },
          },
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      atomCounts: {
        1: 2,
        2: 3,
      },
      atomsByRowIndex: [
        {},
        {
          1: {
            color: Color.ANY,
            id: '1',
            counter: 2,
            position: NaN,
            fns: atomFns1,
            shape: Shape.CIRCLE,
          },
          2: {
            color: Color.RED,
            id: '2',
            counter: 2,
            position: NaN,
            fns: atomFns2,
            shape: Shape.ANY,
          },
        },
      ],
      boardObjectsById: {
        1: {
          color: Color.RED,
          id: '1',
          shape: Shape.CIRCLE,
          x: 0,
          y: 2,
        },
      },
      ruleRowIndex: 1,
      boardObjectsToBucketsToAtoms: {
        1: {
          [BucketPosition.TR]: new Set(['2']),
          [BucketPosition.TL]: new Set(['1', '2']),
          [BucketPosition.BR]: new Set(['2']),
          [BucketPosition.BL]: new Set(['2']),
        },
      },
    } as State);

    expect(
      reducer(
        {
          ...initialState,
          atomCounts: {
            1: 2,
            2: 3,
          },
          atomsByRowIndex: [
            {},
            {
              1: {
                color: Color.ANY,
                id: '1',
                counter: 2,
                position: NaN,
                fns: atomFns1,
                shape: Shape.CIRCLE,
              },
              2: {
                color: Color.RED,
                id: '2',
                counter: 2,
                position: NaN,
                fns: atomFns2,
                shape: Shape.ANY,
              },
            },
          ],
          boardObjectsById: {
            1: {
              color: Color.RED,
              id: '1',
              shape: Shape.CIRCLE,
              x: 0,
              y: 2,
            },
          },
          totalMoveHistory: [{ dropped: BucketPosition.BL, dragged: '1' }],
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      atomCounts: {
        1: 2,
        2: 3,
      },
      atomsByRowIndex: [
        {},
        {
          1: {
            color: Color.ANY,
            id: '1',
            counter: 2,
            position: NaN,
            fns: atomFns1,
            shape: Shape.CIRCLE,
          },
          2: {
            color: Color.RED,
            id: '2',
            counter: 2,
            position: NaN,
            fns: atomFns2,
            shape: Shape.ANY,
          },
        },
      ],
      boardObjectsById: {
        1: {
          color: Color.RED,
          id: '1',
          shape: Shape.CIRCLE,
          x: 0,
          y: 2,
        },
      },
      ruleRowIndex: 1,
      totalMoveHistory: [{ dropped: BucketPosition.BL, dragged: '1' }],
      boardObjectsToBucketsToAtoms: {
        1: {
          [BucketPosition.TR]: new Set([]),
          [BucketPosition.TL]: new Set(['1']),
          [BucketPosition.BR]: new Set([]),
          [BucketPosition.BL]: new Set(['2']),
        },
      },
    } as State);
  });
});
