import { Store } from 'redux';
import { RootState } from '../store/reducers';
import { RootAction } from '../store/actions';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix

declare global {
  interface Window {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    __REDUX_DEVTOOLS_EXTENSION__: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    store: Store<RootState, RootAction>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cypress: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dynamicMiddlewaresInstance: any;
  }
}
