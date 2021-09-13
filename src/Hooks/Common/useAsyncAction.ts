import { useState, useCallback } from 'react';
import { callActionAsync } from 'Utils/functions';
import { Action } from 'Interfaces/Common';

interface ExecuteAction<TPayload, TResponse> {
  (actionPayload: TPayload): Promise<TResponse>;
}

type isExecuting = {} & boolean;

export default <TPayload, TResponse>(action: Action<TPayload, TResponse>) => {
  const [isExecuting, setIsExecuting] = useState<isExecuting>(false);
  const execute: ExecuteAction<TPayload, TResponse> = useCallback(
    (actionPayload: TPayload) =>
      callActionAsync<TPayload, TResponse>(action, actionPayload, setIsExecuting),
    [action],
  );

  return [execute, isExecuting] as const;
};
