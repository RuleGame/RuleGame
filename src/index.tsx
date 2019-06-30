import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './index.css';
import App from './App';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>,
  document.getElementById('root'),
);
