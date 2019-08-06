import { AnyAction, applyMiddleware, compose, createStore, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { persistStore } from 'redux-persist';
import { RootAction } from './actions';
import { rootEpic } from './epics/index';
import createRootReducer, { RootState } from './reducers';

const DEV = process.env.NODE_ENV !== 'production';

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();

const middleware: Middleware[] = [epicMiddleware];

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

const persistor = persistStore(store);
export default () => {
  epicMiddleware.run(rootEpic);
  return { store, persistor };
};
