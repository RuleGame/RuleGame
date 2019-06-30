import React, { useState, useEffect, useCallback } from 'react';

import Board from './components/Board';

import { Log } from './@types/index';
import { initialBoardObjectsList } from './constants';

const App = (): JSX.Element => {
  const [historyLog, setHistoryLog] = useState([] as Log[]);
  const [initialBoardObjectsIndex, setInitialBoardObjectsIndex] = useState(0);

  useEffect(() => {
    console.log(historyLog);
  }, [historyLog]);

  return (
    <Board
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
  );
};

export default App;
