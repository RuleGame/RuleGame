import React, { useCallback, useState, useReducer } from 'react';
import styled from 'styled-components';
import { Log, Rule } from './@types/index';
import Game from './components/Game';

type State = {
  rule: Rule;
};

type Action = {
  type: 'UPDATE_RULE';
  rule: Rule;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE_RULE':
      return {
        ...state,
        rule: action.rule,
      };
    default:
      return state;
  }
};

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
  const [logs, setLogs] = useState<Log[]>([]);

  const [{ rule }, dispatch] = useReducer(reducer, {
    rule: 'closest',
  });

  const setRule = (rule: Rule) => dispatch({ type: 'UPDATE_RULE', rule });

  return (
    <>
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
        <StyledGame
          rule={rule}
          addLog={useCallback((log) => setLogs((state) => [...state, log]), [])}
        />
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
