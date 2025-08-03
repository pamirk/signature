import { createAsyncAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from '@/Interfaces/ActionCreators.ts';
import { promisifyAsyncAction } from 'Utils/functions';
import { RequestHistoryGetActionTypes } from './actionTypes';
import { RequestHistoryData, RequestHistoryGetPayload } from 'Interfaces/RequestsHistory';

export const getRequestHistory = createAsyncAction(
  RequestHistoryGetActionTypes.request,
  RequestHistoryGetActionTypes.success,
  RequestHistoryGetActionTypes.failure,
  RequestHistoryGetActionTypes.cancel,
)<
  [RequestHistoryGetPayload, PromisifiedActionMeta],
  [RequestHistoryData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getRequestHistory = promisifyAsyncAction(getRequestHistory);
