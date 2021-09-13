import sagas from './sagas';
import { $getRequestHistory, getRequestHistory } from './actionCreators';
import reducer from './reducer';

export default {
  sagas,
  reducer,
  actions: {
    getRequestHistory,
  },
};

export const $actions = {
  getRequestHistory: $getRequestHistory,
};
