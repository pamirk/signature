import { createAsyncAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from '@/Interfaces/ActionCreators.ts';
import {
  IntegrationUrlPayload,
  IntegrationAuthTokenPayload,
  IntegrationActionPayload,
  IntegrationDeactivatePayload,
} from 'Interfaces/Integration';
import {
  IntegrationAuthUrlGetActionTypes,
  IntegrationAuthTokenGetActionTypes,
  IntegrationDeactivateActionTypes,
} from './actionTypes';
import { promisifyAsyncAction } from 'Utils/functions';

export const getAuthUrl = createAsyncAction(
  IntegrationAuthUrlGetActionTypes.request,
  IntegrationAuthUrlGetActionTypes.success,
  IntegrationAuthUrlGetActionTypes.failure,
  IntegrationAuthUrlGetActionTypes.cancel,
)<
  [IntegrationActionPayload, PromisifiedActionMeta],
  [IntegrationUrlPayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getAuthUrl = promisifyAsyncAction(getAuthUrl);

export const getAuthToken = createAsyncAction(
  IntegrationAuthTokenGetActionTypes.request,
  IntegrationAuthTokenGetActionTypes.success,
  IntegrationAuthTokenGetActionTypes.failure,
  IntegrationAuthTokenGetActionTypes.cancel,
)<
  [IntegrationActionPayload, PromisifiedActionMeta],
  [IntegrationAuthTokenPayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getAuthToken = promisifyAsyncAction(getAuthToken);

export const deactivate = createAsyncAction(
  IntegrationDeactivateActionTypes.request,
  IntegrationDeactivateActionTypes.success,
  IntegrationDeactivateActionTypes.failure,
  IntegrationDeactivateActionTypes.cancel,
)<
  [IntegrationActionPayload, PromisifiedActionMeta],
  [IntegrationDeactivatePayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deactivate = promisifyAsyncAction(deactivate);
