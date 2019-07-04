import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BoardObjectType, BucketPosition, Log, Rule } from './@types/index';
import Board from './components/Board';
import { initialBoardObjects, cols, rows } from './constants';
import Bucket from './components/Bucket';

const StyledApp = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 90vh;
`;

const StyledBoard = styled(Board)<{}>`
  margin: auto;
  width: 100vh;
  max-width: 100vw;
  height: 100vw;
  max-height: 90vh;
  padding: 1em;
  box-sizing: border-box;
`;

const bucketOrdering: BucketPosition[] = ['TL', 'TR', 'BR', 'BL'];

const App = (): JSX.Element => {
  const [historyLog, setHistoryLog] = useState([] as Log[]);
  const [initialBoardObjectsState, setInitialBoardObjects] = useState([] as BoardObjectType[]);
  const [rule, setRule] = useState('closest' as Rule);
  const [currClockwiseIndex, setCurrClockwiseIndex] = useState<undefined | number>(undefined);

  useEffect(() => {
    if (rule === 'clockwise') {
      setInitialBoardObjects(
        initialBoardObjects.map((boardObject) => ({
          ...boardObject,
          buckets: new Set<BucketPosition>(['TL', 'TR', 'BL', 'BR']),
        })),
      );
      setCurrClockwiseIndex(undefined);
    } else if (rule === 'closest') {
      setInitialBoardObjects(
        initialBoardObjects.map((boardObject) => ({
          ...boardObject,
          buckets: new Set<BucketPosition>([
            ...(boardObject.x <= cols / 2 && boardObject.y <= rows / 2
              ? ['BL' as BucketPosition]
              : []),
            ...(boardObject.x >= cols / 2 && boardObject.y <= rows / 2
              ? ['BR' as BucketPosition]
              : []),
            ...(boardObject.x >= cols / 2 && boardObject.y >= rows / 2
              ? ['TR' as BucketPosition]
              : []),
            ...(boardObject.x <= cols / 2 && boardObject.y >= rows / 2
              ? ['TL' as BucketPosition]
              : []),
          ]),
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
    <>
      <StyledApp>
        <label htmlFor="closest">
          <input
            type="radio"
            id="clockwise"
            name="rule"
            checked
            onChange={useCallback(() => setRule('closest'), [])}
          />
          closest
        </label>
        <label htmlFor="clockwise">
          <input
            type="radio"
            id="clockwise"
            name="rule"
            onChange={useCallback(() => setRule('clockwise'), [])}
          />
          clockwise
        </label>
        <StyledBoard
          onComplete={useCallback((log) => {
            setHistoryLog((state) => [...state, log]);
            setInitialBoardObjects((state) => [...state]);
            if (rule === 'clockwise') {
              setCurrClockwiseIndex(
                (state) =>
                  ((state !== undefined ? state : bucketOrdering.indexOf(log.dropSuccess.dropped)) +
                    1) %
                  bucketOrdering.length,
              );
            }
          }, [])}
          initialBoardObjects={initialBoardObjectsState}
        />
      </StyledApp>
      <h2>History Log (Testing Only):</h2>
      {historyLog.map((log) => (
        <>
          <div>{JSON.stringify(log)}</div>
          <br />
        </>
      ))}
    </>
  );
};

export default App;
