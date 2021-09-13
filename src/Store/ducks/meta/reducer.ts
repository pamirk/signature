import { createReducer } from 'typesafe-actions';
import { PaginationData } from 'Interfaces/Common';
import { getDocuments } from '../document/actionCreators';
import { getApiKeys } from '../apiKey/actionCreators';
import { getRequestHistory } from '../requestHistory/actionCreators';
import { setIsEmailConfirmed } from '../user/actionCreators';

interface MetaReducer {
  documents: PaginationData;
  templates: PaginationData;
  apiKeys: PaginationData;
  requestHistory: PaginationData;
  isEmailConfirmed: boolean;
}

export default createReducer({
  documents: {},
  templates: {},
  apiKeys: {},
  isEmailConfirmed: false,
} as MetaReducer)
  .handleAction(getDocuments.success, (state, { payload }) => ({
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
  .handleAction(setIsEmailConfirmed, (state, { payload }) => ({
    ...state,
    isEmailConfirmed: payload,
  }));
