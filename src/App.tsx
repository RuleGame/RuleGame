import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Game from './components/Game';
import { initBoard } from './store/actions/game';
import { RootState } from './store/reducers/index';
import { blueSquareAnyBucket, setAllBucketsMapperCreator } from './components/__helpers__/rule-set-mappers';

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
  const logs = useSelector((state: RootState) => state.game.logs);

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
                  initBoard('closest', setAllBucketsMapperCreator(['BL', 'BR', 'TL', 'TR'])),
                ),
              [dispatch],
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
            onChange={useCallback(() => dispatch(initBoard('clockwise', blueSquareAnyBucket)), [
              dispatch,
            ])}
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
