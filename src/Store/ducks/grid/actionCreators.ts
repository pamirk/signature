import { createAsyncAction, createAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from 'Interfaces/ActionCreators';
import { promisifyAsyncAction } from 'Utils/functions';
import {
  GridGetActionTypes,
  GridItemsDeleteActionTypes,
  GridUpdateActionTypes,
  GridGetForSignatureRequestsActionTypes,
  GridItemsMoveToTrashActionTypes,
  EmptyTrashActionTypes,
} from './actionTypes';
import {
  GridData,
  GridGetPayload,
  GridGetForSignatureRequestsPayload,
  GridItem,
  GridItemsDeletePayload,
  GridUpdatePayload,
} from 'Interfaces/Grid';

export const getGrid = createAsyncAction(
  GridGetActionTypes.request,
  GridGetActionTypes.success,
  GridGetActionTypes.failure,
  GridGetActionTypes.cancel,
)<
  [GridGetPayload, PromisifiedActionMeta],
  [GridData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getGrid = promisifyAsyncAction(getGrid);

export const getGridForSignatureRequests = createAsyncAction(
  GridGetForSignatureRequestsActionTypes.request,
  GridGetForSignatureRequestsActionTypes.success,
  GridGetForSignatureRequestsActionTypes.failure,
  GridGetForSignatureRequestsActionTypes.cancel,
)<
  [GridGetForSignatureRequestsPayload, PromisifiedActionMeta],
  [GridData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getGridForSignatureRequests = promisifyAsyncAction(
  getGridForSignatureRequests,
);

export const setCurrentFolderId = createAction(
  'grid/setCurrentFolderId',
  (payload: { id: string | undefined }) => payload,
)();

export const updateGrid = createAsyncAction(
  GridUpdateActionTypes.request,
  GridUpdateActionTypes.success,
  GridUpdateActionTypes.failure,
  GridUpdateActionTypes.cancel,
)<
  [GridUpdatePayload, PromisifiedActionMeta],
  [GridItem, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateGrid = promisifyAsyncAction(updateGrid);

export const deleteGridItems = createAsyncAction(
  GridItemsDeleteActionTypes.request,
  GridItemsDeleteActionTypes.success,
  GridItemsDeleteActionTypes.failure,
  GridItemsDeleteActionTypes.cancel,
)<
  [GridItemsDeletePayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteGridItems = promisifyAsyncAction(deleteGridItems);

export const moveToTrashGridItems = createAsyncAction(
  GridItemsMoveToTrashActionTypes.request,
  GridItemsMoveToTrashActionTypes.success,
  GridItemsMoveToTrashActionTypes.failure,
  GridItemsMoveToTrashActionTypes.cancel,
)<
  [GridItemsDeletePayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $moveToTrashGridItems = promisifyAsyncAction(moveToTrashGridItems);

export const emptyTrash = createAsyncAction(
  EmptyTrashActionTypes.request,
  EmptyTrashActionTypes.success,
  EmptyTrashActionTypes.failure,
  EmptyTrashActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $emptyTrash = promisifyAsyncAction(emptyTrash);
