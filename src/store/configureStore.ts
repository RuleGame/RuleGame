import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
// @ts-ignore
import { createDynamicMiddlewares } from 'redux-dynamic-middlewares';
/* eslint-enable */
import { persistStore } from 'redux-persist';
import { RootAction } from './actions';
import createRootReducer, { RootState } from './reducers';
import rootSaga from './sagas';

const DEV = process.env.NODE_ENV !== 'production';

const sagaMiddleware = createSagaMiddleware({});

const middleware: Middleware[] = [sagaMiddleware];

const dynamicMiddlewaresInstance = createDynamicMiddlewares();

if (!DEV) {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => {};
  }
} else {
  middleware.push(
    createLogger({
      predicate: (getState, action: { type: string; payload: {}; meta: {} }) =>
        !/^@@/.test(action.type),
      collapsed: true,
    }),
    dynamicMiddlewaresInstance.enhancer,
  );
}

const composeEnhancers =
  DEV && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const store = createStore<RootState, RootAction, {}, undefined>(
  createRootReducer(),
  composeEnhancers(applyMiddleware(...middleware)),
);

const persistor = persistStore(store);

if (window.Cypress && DEV) {
  window.store = store;
  window.dynamicMiddlewaresInstance = dynamicMiddlewaresInstance;
}

export type AppDispatch = typeof store.dispatch;

export default () => {
  sagaMiddleware.run(rootSaga);
  return { store, persistor };
};
