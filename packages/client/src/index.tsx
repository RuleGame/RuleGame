import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import App from './App';
import './index.css';
import configureStore from './store/configureStore';

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: new HttpLink({
//     uri: 'http://localhost:4000/',
//   }),
// });

export const { store } = configureStore();

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  // <ApolloProvider client={client}>
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </Provider>,
  // </ApolloProvider>,
  document.getElementById('root'),
);
