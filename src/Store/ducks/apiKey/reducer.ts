import { createReducer } from 'typesafe-actions';
import { NormalizedEntity } from 'Interfaces/Common';
import { ApiKey } from 'Interfaces/ApiKey';
import {
  createApiKey,
  getApiKey,
  getApiKeys,
  recoverApiKey,
  revokeApiKey,
} from './actionCreators';

export default createReducer({} as NormalizedEntity<ApiKey>)
  .handleAction([createApiKey.success, getApiKey.success], (state, action) => ({
    ...state,
    [action.payload.id]: action.payload,
  }))
  .handleAction(getApiKeys.success, (state, action) => ({
    ...action.payload.apiKeys,
  }))
  .handleAction([revokeApiKey.success, recoverApiKey.success], (state, action) => ({
    ...state,
    [action.payload.id]: { ...state[action.payload.id], ...action.payload },
  }));
