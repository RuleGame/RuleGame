import atomMatch, { xYToPosition, positionToXy } from '../atom-match';
import { Color } from '../../constants/Color';
import { Shape } from '../../constants/Shape';

describe('atom-match', () => {
  it('matches', () => {
    expect(
      atomMatch(
        { x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE },
        { 1: 2 },
      )({
        counter: 2,
        shape: Shape.CIRCLE,
        id: '1',
        color: Color.BLACK,
        fns: [],
      }),
    ).toEqual(true);
  });

  it('does not match on counter', () => {
    expect(
      atomMatch(
        { x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE },
        { 1: 0 },
      )({
        counter: 2,
        shape: Shape.ANY,
        id: '1',
        color: Color.ANY,
        fns: [],
      }),
    ).toEqual(false);
  });

  it('does not match on shape', () => {
    expect(
      atomMatch(
        { x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE },
        { 1: Infinity },
      )({
        counter: 2,
        shape: Shape.TRIANGLE,
        id: '1',
        color: Color.ANY,
        fns: [],
      }),
    ).toEqual(false);
  });

  it('does not match on color', () => {
    expect(
      atomMatch(
        { x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE },
        { 1: Infinity },
      )({
        counter: 2,
        shape: Shape.ANY,
        id: '1',
        color: Color.BLUE,
        fns: [],
      }),
    ).toEqual(false);
  });

  it('accepts anys', () => {
    expect(
      atomMatch(
        { x: 2, y: 1, color: Color.BLACK, id: '1', shape: Shape.CIRCLE },
        { 1: Infinity },
      )({
        counter: 2,
        shape: Shape.ANY,
        id: '1',
        color: Color.ANY,
        fns: [],
      }),
    ).toEqual(true);
  });
});

describe('xYToPosition', () => {
  it('works', () => {
    expect(xYToPosition(1, 1)).toEqual(1);

    expect(xYToPosition(6, 6)).toEqual(36);

    expect(xYToPosition(2, 1)).toEqual(2);

    expect(xYToPosition(1, 2)).toEqual(7);
  });
});

describe('positionToXy', () => {
  it('works', () => {
    expect(positionToXy(1)).toEqual({ x: 1, y: 1 });
    expect(positionToXy(2)).toEqual({ x: 2, y: 1 });
    expect(positionToXy(3)).toEqual({ x: 3, y: 1 });
    expect(positionToXy(6)).toEqual({ x: 6, y: 1 });
    expect(positionToXy(31)).toEqual({ x: 1, y: 6 });
    expect(positionToXy(36)).toEqual({ x: 6, y: 6 });
  });
});
