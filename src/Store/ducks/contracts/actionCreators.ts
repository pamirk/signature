import { createAsyncAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from '@/Interfaces/ActionCreators.ts';
import { ContractsPayload } from 'Interfaces/Contract';
import { promisifyAsyncAction } from 'Utils/functions';
import { DocumentGetFormRequestContractsActionTypes } from './actionTypes';
import { Contract } from 'Interfaces/Contract';
import { NormalizedEntity } from 'Interfaces/Common';

export const getFormRequestContracts = createAsyncAction(
  DocumentGetFormRequestContractsActionTypes.request,
  DocumentGetFormRequestContractsActionTypes.success,
  DocumentGetFormRequestContractsActionTypes.failure,
  DocumentGetFormRequestContractsActionTypes.cancel,
)<
  [ContractsPayload, PromisifiedActionMeta],
  [NormalizedEntity<Contract>, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();
export const $getFormRequestContracts = promisifyAsyncAction(getFormRequestContracts);
