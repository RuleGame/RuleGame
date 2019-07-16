import React, { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import Game from './components/Game';
import { initBoard } from './store/actions/game';
import { RootState } from './store/reducers/index';
import { blueSquareAnyBucket, setAllBucketsTo } from './components/__helpers__/rule-set-mappers';
import { setPositions } from './components/__helpers__/positions';

const StyledApp = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledGame = styled(Game)<{}>`
  margin: auto;
  width: 100vh;
  max-width: 100vw;
  height: 100vw;
  max-height: 90vh;
  padding: 1em;
  box-sizing: border-box;
`;

const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const rule = useSelector((state: RootState) => state.game.rule);
  const boardObjectsById = useSelector((state: RootState) => state.game.boardObjectsById);
  const numBoardObjects = Object.keys(boardObjectsById).length;
  const logs = useSelector((state: RootState) => state.game.logs);

  const allChecked = useMemo(
    () => Object.values(boardObjectsById).every((boardObject) => boardObject.shape === 'check'),
    [boardObjectsById],
  );

  // TODO: Move to constants file
  const minX = 1;
  const minY = 1;

  if (allChecked) {
    dispatch(
      initBoard(
        rule,
        // TODO: Don't use hardcoded conditional checking
        rule === 'clockwise' ? blueSquareAnyBucket : setAllBucketsTo(['BL', 'BR', 'TL', 'TR']),
        setPositions(
          (_.zip(
            _.shuffle(_.range(numBoardObjects + 1)),
            _.shuffle(_.range(numBoardObjects + 1)),
          ) as [number, number][]).reduce<{ x: number; y: number }[]>(
            (acc, curr) => [...acc, { x: curr[0] + minX, y: curr[1] + minY }],
            [],
          ),
        ),
      ),
    );
  }

  return (
    <>
      <StyledApp>
        <label htmlFor="closest">
          <input
            type="radio"
            id="closest"
            name="rule"
            checked={rule === 'closest'}
            onChange={useCallback(
              () =>
                dispatch(
                  initBoard(
                    'closest',
                    setAllBucketsTo(['BL', 'BR', 'TL', 'TR']),
                    setPositions(
                      (_.zip(
                        _.shuffle(_.range(numBoardObjects + 1)),
                        _.shuffle(_.range(numBoardObjects + 1)),
                      ) as [number, number][]).reduce<{ x: number; y: number }[]>(
                        (acc, curr) => [...acc, { x: curr[0] + minX, y: curr[1] + minY }],
                        [],
                      ),
                    ),
                  ),
                ),
              [dispatch, numBoardObjects],
            )}
          />
          closest
        </label>
        <label htmlFor="clockwise">
          <input
            type="radio"
            id="clockwise"
            name="rule"
            checked={rule === 'clockwise'}
            onChange={useCallback(
              () =>
                dispatch(
                  initBoard(
                    'clockwise',
                    blueSquareAnyBucket,
                    setPositions(
                      (_.zip(
                        _.shuffle(_.range(numBoardObjects + 1)),
                        _.shuffle(_.range(numBoardObjects + 1)),
                      ) as [number, number][]).reduce<{ x: number; y: number }[]>(
                        (acc, curr) => [...acc, { x: curr[0] + minX, y: curr[1] + minY }],
                        [],
                      ),
                    ),
                  ),
                ),
              [dispatch, numBoardObjects],
            )}
          />
          clockwise
        </label>
        <StyledGame boardObjectsById={boardObjectsById} />
      </StyledApp>
      <div>
        <h2>History Log (Testing Only):</h2>
        {logs.map((log) => (
          <React.Fragment key={log.id}>
            <div>{JSON.stringify(log)}</div>
            <br />
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default App;
