import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import styled from 'styled-components';

import './App.css';
import BoardObject from './components/BoardObject';
import Bucket from './components/Bucket';

type BoardObjectType = {
  color: string,
  shape: 'square' | 'triangle' | 'circle' | 'triangle' | 'star',
  x: number,
  y: number,
  buckets: ('TL' | 'TR' | 'BL' | 'BR')[],
};

const rows = 8;
const cols = 8;

// NOTE: x and y start at 1
const boardObjects: BoardObjectType[] = [
  {
    shape: 'square',
    color: 'blue',
    x: 2,
    y: 2,
    buckets: ['TL', 'BL'],
  },
  {
    shape: 'triangle',
    color: 'black',
    x: 5,
    y: 2,
    buckets: [],
  },
  {
    shape: 'circle',
    color: 'red',
    x: 5,
    y: 4,
    buckets: [],
  },
  {
    shape: 'triangle',
    color: 'yellow',
    x: 2,
    y: 6,
    buckets: [],
  },
  {
    shape: 'star',
    color: 'blue',
    x: 5,
    y: 6,
    buckets: ['TL', 'BL'],
  },
];

const bucketCoords = [{ x: 1, y: 1 }, { x: 1, y: rows }, { x: cols, y: 1 }, { x: cols, y: rows }];

const StyledBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(${rows}, 1fr);
  grid-template-columns: repeat(${cols}, 1fr);
  width: 100vw;
  height: 100vh;
`;

const StyledBoardObject = styled(BoardObject)`
  grid-column: ${(boardObject) => boardObject.x + 1};
  grid-row: ${(boardObject) => boardObject.y + 1};
  background-color: ${(boardObject) => boardObject.color};
`;

const StyledBucket = styled(Bucket)`
  grid-column: ${(bucketCoord) => bucketCoord.x};
  grid-row: ${(bucketCoord) => bucketCoord.y};
  background-color: red;
`;

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <StyledBoard>
          {boardObjects.map((boardObject) => (
            <StyledBoardObject {...boardObject} />
          ))}
          {bucketCoords.map((bucketCoord) => (
            <StyledBucket {...bucketCoord} />
          ))}
        </StyledBoard>
      </div>
    </DndProvider>
  );
};

export default App;
