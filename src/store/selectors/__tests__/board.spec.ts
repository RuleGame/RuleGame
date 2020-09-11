import { moveNumByBoardObjectSelector } from '../board';
import { RootState } from '../../reducers';
import { Code } from '../../../utils/api';

describe('moveNumByBoardObjectSelector', () => {
  it('works', () => {
    const state = {
      board: {
        transcript: [
          {
            bucketNo: 3,
            code: Code.ACCEPT,
            pieceId: 1,
            pos: 7,
          },
          {
            bucketNo: 1,
            code: Code.ACCEPT,
            pieceId: 2,
            pos: 20,
          },
          {
            bucketNo: 0,
            code: Code.DENY,
            pieceId: 3,
            pos: 31,
          },
          {
            bucketNo: 2,
            code: Code.DENY,
            pieceId: 3,
            pos: 31,
          },
          {
            bucketNo: 3,
            code: Code.ACCEPT,
            pieceId: 3,
            pos: 31,
          },
        ],
      },
    };

    expect(moveNumByBoardObjectSelector(state as RootState)).toEqual({ 1: 1, 2: 2, 3: 3 });
  });
});
