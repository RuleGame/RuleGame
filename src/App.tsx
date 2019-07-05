import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import styled from 'styled-components';
import { BoardObjectType, BucketPositionsMapper, Log, Rule } from './@types/index';
import Board from './components/Board';
import { closestBucketsMapper, setAllBucketsMapper } from './components/__helpers__/buckets';
import { afterDragTimeout, bucketOrder, initialBoardObjects } from './constants';

type Action =
  | { type: 'ADD_LOG'; log: Log }
  | { type: 'SET_BOARD_OBJECTS'; boardObjects: BoardObjectType[] }
  | { type: 'SET_RULE'; rule: Rule }
  | {
      type: 'SET_BOARD_OBJECTS_BUCKETS';
      mapper: BucketPositionsMapper;
    };

type State = {
  historyLog: Log[];
  boardObjects: BoardObjectType[];
  rule: Rule;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_LOG':
      return {
        ...state,
        historyLog: [...state.historyLog, action.log],
      };
    case 'SET_BOARD_OBJECTS':
      return {
        ...state,
        boardObjects: [...action.boardObjects],
      };
    case 'SET_RULE':
      return {
        ...state,
        rule: action.rule,
      };
    case 'SET_BOARD_OBJECTS_BUCKETS': {
      return {
        ...state,
        boardObjects: state.boardObjects.map(action.mapper),
      };
    }
    default:
      return state;
  }
};

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

const App = (): JSX.Element => {
  // Won't cause an update.
  const ref = useRef<{ index: undefined | number; boardId: number }>({
    index: undefined,
    boardId: 0,
  });
  const [state, dispatch] = useReducer(reducer, {
    historyLog: [],
    boardObjects: initialBoardObjects.map(setAllBucketsMapper(['TL', 'TR', 'BR', 'BL'])),
    rule: 'closest',
  });

  const { rule } = state;
  useEffect(() => {
    if (rule === 'clockwise') {
      // SET_BOARD_OBJECTS_BUCKETS
      dispatch({
        type: 'SET_BOARD_OBJECTS_BUCKETS',
        mapper: setAllBucketsMapper(['TL', 'TR', 'BR', 'BL']),
      });
      ref.current.index = undefined;
    } else if (rule === 'closest') {
      dispatch({ type: 'SET_BOARD_OBJECTS_BUCKETS', mapper: closestBucketsMapper });
    }
  }, [rule]);

  return (
    <>
      <StyledApp>
        <label htmlFor="closest">
          <input
            type="radio"
            id="clockwise"
            name="rule"
            checked
            onChange={useCallback(() => dispatch({ type: 'SET_RULE', rule: 'closest' }), [])}
          />
          closest
        </label>
        <label htmlFor="clockwise">
          <input
            type="radio"
            id="clockwise"
            name="rule"
            onChange={useCallback(() => dispatch({ type: 'SET_RULE', rule: 'clockwise' }), [])}
          />
          clockwise
        </label>
        <StyledBoard
          id={ref.current.boardId}
          onComplete={useCallback(
            (log) => {
              const { current } = ref;
              current.boardId += 1;
              dispatch({ type: 'ADD_LOG', log });

              setTimeout(() => {
                if (rule === 'clockwise') {
                  current.index =
                    ((current.index !== undefined
                      ? current.index
                      : bucketOrder.indexOf(log.dropSuccess.dropped)) +
                      1) %
                    bucketOrder.length;
                  dispatch({
                    type: 'SET_BOARD_OBJECTS_BUCKETS',
                    mapper: setAllBucketsMapper([bucketOrder[current.index]]),
                  });
                } else if (rule === 'closest') {
                  dispatch({
                    type: 'SET_BOARD_OBJECTS_BUCKETS',
                    mapper: closestBucketsMapper,
                  });
                }
              }, afterDragTimeout);
            },
            [rule],
          )}
          initialBoardObjects={state.boardObjects}
        />
      </StyledApp>
      <h2>History Log (Testing Only):</h2>
      {state.historyLog.map((log) => (
        <React.Fragment key={log.id}>
          <div>{JSON.stringify(log)}</div>
          <br />
        </React.Fragment>
      ))}
    </>
  );
};

export default App;
