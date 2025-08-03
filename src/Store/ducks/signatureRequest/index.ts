import sagas from './sagas';
import { $deleteSignatureRequests, deleteSignatureRequests } from './actionCreators';
import reducer from './reducer';

export default {
  sagas,
  reducer,
  actions: {
    deleteSignatureRequests,
  },
};

export const $actions = {
  deleteSignatureRequests: $deleteSignatureRequests,
};
