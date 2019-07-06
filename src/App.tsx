import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Log, Rule } from './@types/index';
import Game from './components/Game';

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
  const [rule, setRule] = useState<Rule>('closest');
  const [logs, setLogs] = useState<Log[]>([]);

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
