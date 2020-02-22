import { Store } from 'redux';
import { RootState } from '../store/reducers';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix

declare global {
  interface Window {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    __REDUX_DEVTOOLS_EXTENSION__: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    store: Store<RootState>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cypress: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dynamicMiddlewaresInstance: any;
  }
}

declare module '*.png' {
  const resource: string;
  export = resource;
}
declare module '*.svg' {
  const resource: string;
  export = resource;
}
declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.pcss' {
  const resource: string;
  export = resource;
}
declare module '*.json' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resource: any;
  export = resource;
}

declare module '*.txt' {
  const resource: string;
  export = resource;
}
