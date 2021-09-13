import { createAsyncAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from 'Interfaces/ActionCreators';
import {
  ApiKey,
  ApiKeyCreatePayload,
  ApiKeysData,
  ApiKeyIdPayload,
  ApiKeyCreateResult,
  ApiKeysGetPayload,
} from 'Interfaces/ApiKey';
import { promisifyAsyncAction } from 'Utils/functions';
import {
  ApiKeyCreateActionTypes,
  ApiKeyGetActionTypes,
  ApiKeysGetActionTypes,
  ApiKeysDeleteActionTypes,
  ApiKeyDeleteActionTypes,
  ApiKeyRevokeActionTypes,
  ApiKeyRecoverActionTypes,
} from './actionTypes';

export const createApiKey = createAsyncAction(
  ApiKeyCreateActionTypes.request,
  ApiKeyCreateActionTypes.success,
  ApiKeyCreateActionTypes.failure,
  ApiKeyCreateActionTypes.cancel,
)<
  [ApiKeyCreatePayload, PromisifiedActionMeta],
  [ApiKeyCreateResult, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createApiKey = promisifyAsyncAction(createApiKey);

export const getApiKeys = createAsyncAction(
  ApiKeysGetActionTypes.request,
  ApiKeysGetActionTypes.success,
  ApiKeysGetActionTypes.failure,
  ApiKeysGetActionTypes.cancel,
)<
  [ApiKeysGetPayload, PromisifiedActionMeta],
  [ApiKeysData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getApiKeys = promisifyAsyncAction(getApiKeys);

export const getApiKey = createAsyncAction(
  ApiKeyGetActionTypes.request,
  ApiKeyGetActionTypes.success,
  ApiKeyGetActionTypes.failure,
  ApiKeyGetActionTypes.cancel,
)<
  [ApiKeyIdPayload, PromisifiedActionMeta],
  [ApiKey, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getApiKey = promisifyAsyncAction(getApiKey);

interface ApiKeysDeletePayload {
  apiKeyIds: string[];
}

export const deleteApiKeys = createAsyncAction(
  ApiKeysDeleteActionTypes.request,
  ApiKeysDeleteActionTypes.success,
  ApiKeysDeleteActionTypes.failure,
  ApiKeysDeleteActionTypes.cancel,
)<
  [ApiKeysDeletePayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteApiKeys = promisifyAsyncAction(deleteApiKeys);

export const deleteApiKey = createAsyncAction(
  ApiKeyDeleteActionTypes.request,
  ApiKeyDeleteActionTypes.success,
  ApiKeyDeleteActionTypes.failure,
  ApiKeyDeleteActionTypes.cancel,
)<
  [ApiKey['id'], PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteApiKey = promisifyAsyncAction(deleteApiKey);

export const revokeApiKey = createAsyncAction(
  ApiKeyRevokeActionTypes.request,
  ApiKeyRevokeActionTypes.success,
  ApiKeyRevokeActionTypes.failure,
  ApiKeyRevokeActionTypes.cancel,
)<
  [ApiKey['id'], PromisifiedActionMeta],
  [ApiKey, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $revokeApiKey = promisifyAsyncAction(revokeApiKey);

export const recoverApiKey = createAsyncAction(
  ApiKeyRecoverActionTypes.request,
  ApiKeyRecoverActionTypes.success,
  ApiKeyRecoverActionTypes.failure,
  ApiKeyRecoverActionTypes.cancel,
)<
  [ApiKey['id'], PromisifiedActionMeta],
  [ApiKey, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $recoverApiKey = promisifyAsyncAction(recoverApiKey);
