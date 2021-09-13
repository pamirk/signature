import sagas from './sagas';
import {
  getAuthUrl,
  $getAuthUrl,
  getAuthToken,
  $getAuthToken,
  deactivate,
  $deactivate,
} from './actionCreators';

export default {
  sagas,
  actions: {
    getAuthUrl,
    getAuthToken,
    deactivate,
  },
};

export const $actions = {
  getAuthUrl: $getAuthUrl,
  getAuthToken: $getAuthToken,
  deactivate: $deactivate,
};
