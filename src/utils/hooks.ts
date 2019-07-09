import { useRef, useEffect } from 'react';

/**
 * Returns previous value before change.
 * (Not previous value passed on last render.)
 * @param value
 */
export function usePrevValue<T extends number | string | boolean | undefined | null>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
