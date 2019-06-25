import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import styled from 'styled-components';

import { BoardObjectType, BucketPosition, BucketType, Item } from './@types';
import BoardObject from './components/BoardObject';
import Bucket from './components/Bucket';
import { boardObjects, bucketCoords, cols, rows } from './constants';

import './App.css';

const StyledBoard = styled('div')`
  display: grid;
  grid-template-rows: repeat(${rows}, 1fr);
  grid-template-columns: repeat(${cols}, 1fr);
  width: 100vw;
  height: 100vh;
`;

const StyledBoardObject = styled(BoardObject)<BoardObjectType>`
  grid-column: ${(boardObject) => boardObject.x + 1};
  grid-row: ${(boardObject) => rows - boardObject.y};
  background-color: ${(boardObject) => boardObject.color};
`;

const StyledBucket = styled(Bucket)<BucketType>`
  grid-column: ${(bucketCoord) => bucketCoord.x + 1};
  grid-row: ${(bucketCoord) => rows - bucketCoord.y};
  background-color: red;
`;

// @ts-ignore (Should really be void but the defined return type is undefined.)
const handleDrop = (item: Item): undefined => {
  console.log(item);
};

const canDrop = (pos: BucketPosition): ((item: Item) => boolean) => (item): boolean => {
  return item.buckets.has(pos);
};

const App = (): JSX.Element => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <StyledBoard>
          {boardObjects.map((boardObject) => (
            <StyledBoardObject
              {...boardObject}
              key={`${boardObject.x}-${boardObject.y}`}
              item={{ type: 'object', buckets: boardObject.buckets }}
            />
          ))}
          {bucketCoords.map((bucketCoord) => (
            <StyledBucket
              {...bucketCoord}
              key={`${bucketCoord.x}-${bucketCoord.y}`}
              onDrop={handleDrop}
              canDrop={canDrop(bucketCoord.pos)}
            />
          ))}
        </StyledBoard>
      </div>
    </DndProvider>
  );
};

export default App;
