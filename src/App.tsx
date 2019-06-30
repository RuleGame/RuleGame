import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Log } from './@types/index';
import Board from './components/Board';
import { initialBoardObjectsList } from './constants';

const StyledApp = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const StyledBoard = styled(Board)<{}>`
  margin: auto;
  width: 100vh;
  max-width: 100vw;
  height: 100vw;
  max-height: 100vh;
  padding: 1em;
  box-sizing: border-box;
`;

const App = (): JSX.Element => {
  const [historyLog, setHistoryLog] = useState([] as Log[]);
  const [initialBoardObjectsIndex, setInitialBoardObjectsIndex] = useState(0);

  useEffect(() => {
    console.log(historyLog);
  }, [historyLog]);

  return (
    <StyledApp>
      <StyledBoard
        onComplete={useCallback(
          (log) => {
            setHistoryLog([...historyLog, log]);
            setInitialBoardObjectsIndex(
              (initialBoardObjectsIndex + 1) % initialBoardObjectsList.length,
            );
          },
          [historyLog, initialBoardObjectsIndex],
        )}
        initialBoardObjects={initialBoardObjectsList[initialBoardObjectsIndex]}
      />
    </StyledApp>
  );
};

export default App;
