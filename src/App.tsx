import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BoardObjectType, BucketPosition, Log, Rule } from './@types/index';
import Board from './components/Board';
import { initialBoardObjects } from './constants';

const StyledApp = styled.div<{}>`
  display: flex;
  flex-direction: column;
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

const bucketOrdering: BucketPosition[] = ['TL', 'TR', 'BR', 'BL'];

const App = (): JSX.Element => {
  const [historyLog, setHistoryLog] = useState([] as Log[]);
  const [initialBoardObjectsState, setInitialBoardObjects] = useState([] as BoardObjectType[]);
  const [rule, setRule] = useState('clockwise' as Rule);
  const [currClockwiseIndex, setCurrClockwiseIndex] = useState<undefined | number>(undefined);

  useEffect(() => {
    console.log(historyLog);
  }, [historyLog]);

  useEffect(() => {
    if (rule === 'clockwise') {
      // TODO: Set buckets
      setInitialBoardObjects(
        initialBoardObjects.map((boardObject) => ({
          ...boardObject,
          buckets: new Set<BucketPosition>(['TL', 'TR', 'BL', 'BR']),
        })),
      );
      setCurrClockwiseIndex(undefined);
    } else if (rule === 'closest') {
      // TODO: Set buckets
      setInitialBoardObjects(
        initialBoardObjects.map((boardObject) => ({
          ...boardObject,
          buckets: new Set<BucketPosition>(['TL', 'TR', 'BL', 'BR']),
        })),
      );
    }
  }, [rule]);

  useEffect(() => {
    // TODO: Set buckets
    if (currClockwiseIndex !== undefined) {
      setInitialBoardObjects(
        initialBoardObjects.map((boardObject) => ({
          ...boardObject,
          buckets: new Set<BucketPosition>([bucketOrdering[currClockwiseIndex]]),
        })),
      );
    }
  }, [currClockwiseIndex]);

  return (
    <StyledApp>
      <label htmlFor="clockwise">
        <input
          type="radio"
          id="clockwise"
          checked
          name="rule"
          onChange={useCallback(() => setRule('clockwise'), [])}
        />
        clockwise
      </label>
      <StyledBoard
        onComplete={useCallback((log) => {
          setHistoryLog((state) => [...state, log]);
          setInitialBoardObjects((state) => [...state]);
          setCurrClockwiseIndex(
            (state) =>
              ((state !== undefined ? state : bucketOrdering.indexOf(log.dropSuccess.dropped)) +
                1) %
              bucketOrdering.length,
          );
        }, [])}
        initialBoardObjects={initialBoardObjectsState}
      />
    </StyledApp>
  );
};

export default App;
