/* eslint-disable-next-line spaced-comment */
/// <reference types="react-scripts" />

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
