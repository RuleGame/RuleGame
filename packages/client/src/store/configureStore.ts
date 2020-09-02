import { AnyAction, applyMiddleware, compose, createStore, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import createSagaMiddleware from 'redux-saga';
/* eslint-disable */
// @ts-ignore
import { createDynamicMiddlewares } from 'redux-dynamic-middlewares';
/* eslint-enable */
import { persistStore } from 'redux-persist';
import { RootAction } from './actions';
import { rootEpic } from './epics';
import createRootReducer, { RootState } from './reducers';
import rootSaga from './sagas';

const DEV = process.env.NODE_ENV !== 'production';

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();

const sagaMiddleware = createSagaMiddleware({});

const middleware: Middleware[] = [epicMiddleware, sagaMiddleware];

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

const store = createStore<RootState, AnyAction, {}, undefined>(
  createRootReducer(),
  composeEnhancers(applyMiddleware(...middleware)),
);

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

if (window.Cypress && DEV) {
  window.store = store;
  window.dynamicMiddlewaresInstance = dynamicMiddlewaresInstance;
}

export default () => {
  epicMiddleware.run(rootEpic);
  return { store, persistor };
};
