import sagas from './sagas';
import {
  createApiKey,
  getApiKey,
  getApiKeys,
  deleteApiKeys,
  $createApiKey,
  $getApiKey,
  $getApiKeys,
  $deleteApiKeys,
  $deleteApiKey,
  deleteApiKey,
  $revokeApiKey,
  revokeApiKey,
  recoverApiKey,
  $recoverApiKey,
} from './actionCreators';
import reducer from './reducer';

export default {
  sagas,
  reducer,
  actions: {
    createApiKey,
    deleteApiKey,
    revokeApiKey,
    getApiKey,
    getApiKeys,
    deleteApiKeys,
    recoverApiKey,
  },
};

export const $actions = {
  createApiKey: $createApiKey,
  getApiKey: $getApiKey,
  getApiKeys: $getApiKeys,
  deleteApiKeys: $deleteApiKeys,
  deleteApiKey: $deleteApiKey,
  revokeApiKey: $revokeApiKey,
  recoverApiKey: $recoverApiKey,
};
