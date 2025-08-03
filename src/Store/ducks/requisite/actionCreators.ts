import { createAsyncAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from '@/Interfaces/ActionCreators.ts';
import { promisifyAsyncAction } from 'Utils/functions';
import {
  DeleteRequisiteActionTypes,
  GetRequisitesActionTypes,
  CreateRequisitesActionTypes,
  UpdateRequisitesActionTypes,
  DownloadFileByUrlActionTypes,
} from './actionTypes';
import {
  Requisite,
  RequisitesPayload,
  RequisiteSiblings,
  RequisiteDeletePayload,
} from 'Interfaces/Requisite';
import { NormalizedEntity } from 'Interfaces/Common';

export const deleteRequisite = createAsyncAction(
  DeleteRequisiteActionTypes.request,
  DeleteRequisiteActionTypes.success,
  DeleteRequisiteActionTypes.failure,
  DeleteRequisiteActionTypes.cancel,
)<
  [RequisiteDeletePayload, PromisifiedActionMeta],
  [RequisiteSiblings, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteRequisite = promisifyAsyncAction(deleteRequisite);

export const getRequisites = createAsyncAction(
  GetRequisitesActionTypes.request,
  GetRequisitesActionTypes.success,
  GetRequisitesActionTypes.failure,
  GetRequisitesActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [NormalizedEntity<Requisite>, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getRequisites = promisifyAsyncAction(getRequisites);

export const createRequisites = createAsyncAction(
  CreateRequisitesActionTypes.request,
  CreateRequisitesActionTypes.success,
  CreateRequisitesActionTypes.failure,
  CreateRequisitesActionTypes.cancel,
)<
  [RequisitesPayload, PromisifiedActionMeta],
  [RequisiteSiblings, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createRequisites = promisifyAsyncAction(createRequisites);

export const updateRequisites = createAsyncAction(
  UpdateRequisitesActionTypes.request,
  UpdateRequisitesActionTypes.success,
  UpdateRequisitesActionTypes.failure,
  UpdateRequisitesActionTypes.cancel,
)<
  [RequisitesPayload, PromisifiedActionMeta],
  [RequisiteSiblings, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateRequisites = promisifyAsyncAction(updateRequisites);

export const downloadFileByUrl = createAsyncAction(
  DownloadFileByUrlActionTypes.request,
  DownloadFileByUrlActionTypes.success,
  DownloadFileByUrlActionTypes.failure,
  DownloadFileByUrlActionTypes.cancel,
)<
  [string, PromisifiedActionMeta],
  [any, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $downloadFileByUrl = promisifyAsyncAction(downloadFileByUrl);
