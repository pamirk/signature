import { useState, useCallback } from 'react';

type Toggleable = {} & boolean;

interface Toggle {
  (): void;
}

export default (initialState: Toggleable) => {
  const [state, setState] = useState(initialState);

  const toggle: Toggle = useCallback(() => {
    setState(!state);
  }, [state]);

  return [state, toggle] as const;
};
