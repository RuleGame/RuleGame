import { positionToXy, xYToPosition } from '../atom-match';

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
