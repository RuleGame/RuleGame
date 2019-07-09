import React, { useCallback, useReducer } from 'react';
import styled from 'styled-components';
import { BucketPosition, Rule } from './@types/index';
import Game from './components/Game';
import { initialBucketsMapper } from './components/__helpers__/buckets';
import { initialBoardObjects } from './constants/index';
import { GameDispatch, gameReducer } from './contexts/game';

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
  const [{ boardObjectsById, rule, logs }, dispatch] = useReducer(gameReducer, {
    boardObjectsById: initialBoardObjects
      .map((mininmalBoardObjectType) => ({
        ...mininmalBoardObjectType,
        buckets: new Set<BucketPosition>(),
        draggable: true,
      }))
      .map(initialBucketsMapper)
      .reduce(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr,
        }),
        {},
      ),
    boardId: 0,
    moveNum: 1,
    logs: [],
    rule: 'clockwise',
  });

  const setRule = (rule: Rule) => dispatch({ type: 'INIT_BOARD', rule });

  return (
    <GameDispatch.Provider value={dispatch}>
      <StyledApp>
        <label htmlFor="closest">
          <input
            type="radio"
            id="closest"
            name="rule"
            checked={rule === 'closest'}
            onChange={useCallback(() => setRule('closest'), [])}
          />
          closest
        </label>
        <label htmlFor="clockwise">
          <input
            type="radio"
            id="clockwise"
            name="rule"
            checked={rule === 'clockwise'}
            onChange={useCallback(() => setRule('clockwise'), [])}
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
    </GameDispatch.Provider>
  );
};

export default App;
