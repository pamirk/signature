import sagas from './sagas';
import { getFormRequestContracts, $getFormRequestContracts } from './actionCreators';
import reducer from './reducer';

export default {
  sagas,
  reducer,
  actions: {
    getFormRequestContracts,
  },
};

export const $actions = {
  getFormRequestContracts: $getFormRequestContracts,
};
