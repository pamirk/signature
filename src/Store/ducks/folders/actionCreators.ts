import { createAsyncAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from 'Interfaces/ActionCreators';
import { promisifyAsyncAction } from 'Utils/functions';
import {
  FolderChangePermissionActionTypes,
  FolderCreateActionTypes,
  FolderGetActionTypes,
  FolderInfoGetActionTypes,
  FoldersDeleteActionTypes,
  FolderUpdateActionTypes,
} from './actionTypes';
import {
  Folder,
  FolderCreatePayload,
  FolderIdPayload,
  FolderInfo,
  FoldersDeletePayload,
  FolderUpdatePayload,
  FoldersData,
  FolderChangePermissionsPayload,
} from 'Interfaces/Folder';

export const createFolder = createAsyncAction(
  FolderCreateActionTypes.request,
  FolderCreateActionTypes.success,
  FolderCreateActionTypes.failure,
  FolderCreateActionTypes.cancel,
)<
  [FolderCreatePayload, PromisifiedActionMeta],
  [Folder, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createFolder = promisifyAsyncAction(createFolder);

export const changePermissions = createAsyncAction(
  FolderChangePermissionActionTypes.request,
  FolderChangePermissionActionTypes.success,
  FolderChangePermissionActionTypes.failure,
  FolderChangePermissionActionTypes.cancel,
)<
  [FolderChangePermissionsPayload, PromisifiedActionMeta],
  [Folder, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $changePermissions = promisifyAsyncAction(changePermissions);

export const updateFolder = createAsyncAction(
  FolderUpdateActionTypes.request,
  FolderUpdateActionTypes.success,
  FolderUpdateActionTypes.failure,
  FolderUpdateActionTypes.cancel,
)<
  [FolderUpdatePayload, PromisifiedActionMeta],
  [Folder, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateFolder = promisifyAsyncAction(updateFolder);

export const deleteFolders = createAsyncAction(
  FoldersDeleteActionTypes.request,
  FoldersDeleteActionTypes.success,
  FoldersDeleteActionTypes.failure,
  FoldersDeleteActionTypes.cancel,
)<
  [FoldersDeletePayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteFolders = promisifyAsyncAction(deleteFolders);

export const getFolderInfo = createAsyncAction(
  FolderInfoGetActionTypes.request,
  FolderInfoGetActionTypes.success,
  FolderInfoGetActionTypes.failure,
  FolderInfoGetActionTypes.cancel,
)<
  [Folder['id'], PromisifiedActionMeta],
  [FolderInfo, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getFolderInfo = promisifyAsyncAction(getFolderInfo);

export const getFolder = createAsyncAction(
  FolderGetActionTypes.request,
  FolderGetActionTypes.success,
  FolderGetActionTypes.failure,
  FolderGetActionTypes.cancel,
)<
  [FolderIdPayload, PromisifiedActionMeta],
  [FoldersData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getFolder = promisifyAsyncAction(getFolder);
