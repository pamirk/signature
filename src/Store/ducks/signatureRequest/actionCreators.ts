import { ActionError, PromisifiedActionMeta } from 'Interfaces/ActionCreators';
import { SigntureRequestsDeletePayload } from 'Interfaces/SignatureRequest';
import { createAsyncAction } from 'typesafe-actions';
import { promisifyAsyncAction } from 'Utils/functions';
import { SigntureRequestsDeleteActionTypes } from './actionTypes';

export const deleteSignatureRequests = createAsyncAction(
  SigntureRequestsDeleteActionTypes.request,
  SigntureRequestsDeleteActionTypes.success,
  SigntureRequestsDeleteActionTypes.failure,
  SigntureRequestsDeleteActionTypes.cancel,
)<
  [SigntureRequestsDeletePayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteSignatureRequests = promisifyAsyncAction(deleteSignatureRequests);
