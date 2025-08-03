import { createReducer } from 'typesafe-actions';
import { PaginationData } from 'Interfaces/Common';
import { getFormRequests } from '../document/actionCreators';
import { getApiKeys } from '../apiKey/actionCreators';
import { getRequestHistory } from '../requestHistory/actionCreators';
import { setIsEmailConfirmed } from '../user/actionCreators';
import {
  getGrid,
  getGridForSignatureRequests,
  setCurrentFolderId,
} from '../grid/actionCreators';
import { getInvoices } from '../billing/actionCreators';

interface MetaReducer {
  documents: PaginationData;
  templates: PaginationData;
  apiKeys: PaginationData;
  requestHistory: PaginationData;
  isEmailConfirmed: boolean;
  grid: PaginationData;
  currentFolderId: string | undefined;
}

export default createReducer({
  documents: {},
  templates: {},
  apiKeys: {},
  grid: {},
  requestHistory: {},
  isEmailConfirmed: false,
} as MetaReducer)
  .handleAction(getFormRequests.success, (state, { payload }) => ({
    ...state,
    documents: payload.paginationData,
  }))
  .handleAction(getApiKeys.success, (state, { payload }) => ({
    ...state,
    apiKeys: payload.paginationData,
  }))
  .handleAction(getRequestHistory.success, (state, { payload }) => ({
    ...state,
    requestHistory: payload.paginationData,
  }))
  .handleAction(getInvoices.success, (state, { payload }) => ({
    ...state,
    invoices: payload.paginationData,
  }))
  .handleAction(setIsEmailConfirmed, (state, { payload }) => ({
    ...state,
    isEmailConfirmed: payload,
  }))
  .handleAction(
    [getGrid.success, getGridForSignatureRequests.success],
    (state, { payload }) => ({
      ...state,
      grid: payload.paginationData,
    }),
  )
  .handleAction(setCurrentFolderId, (state, { payload }) => ({
    ...state,
    currentFolderId: payload.id,
  }));
