import { Action as ReduxAction } from 'redux';

/**
 * Generic interface for Redux actions.
 */
export interface Action<TPayload = any, TMeta = any> extends ReduxAction<string> {
  payload?: TPayload;
  meta?: TMeta;
}

/**
 * Interface for async action creators.
 */
export interface AsyncActionCreator<
  TRequestPayload = any,
  TSuccessPayload = any,
  TFailurePayload = any,
  TCancelPayload = any
> {
  request: (payload: TRequestPayload, meta?: any) => Action<TRequestPayload, any>;
  success: (payload: TSuccessPayload, meta?: any) => Action<TSuccessPayload, any>;
  failure: (payload: TFailurePayload, meta?: any) => Action<TFailurePayload, any>;
  cancel: (payload: TCancelPayload, meta?: any) => Action<TCancelPayload, any>;
}

/**
 * Interface for Promisified Action Meta.
 */
export interface PromisifiedActionMeta {
  defer: {
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  };
  taskId: string;
}

/**
 * Interface for Action Errors.
 */
export interface ActionError {
  message: string;
  statusCode?: number;
  [key: string]: any;
}