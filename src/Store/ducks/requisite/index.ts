import sagas from './sagas';
import {
  deleteRequisite,
  $deleteRequisite,
  getRequisites,
  $getRequisites,
  createRequisites,
  updateRequisites,
  downloadFileByUrl,
  $downloadFileByUrl,
  $updateRequisites,
  $createRequisites,
} from './actionCreators';
import reducer from './reducer';

export default {
  sagas,
  reducer,
  actions: {
    deleteRequisite,
    updateRequisites,
    createRequisites,
    downloadFileByUrl,
    getRequisites,
  },
};

export const $actions = {
  deleteRequisite: $deleteRequisite,
  updateRequisites: $updateRequisites,
  downloadFileByUrl: $downloadFileByUrl,
  getRequisites: $getRequisites,
  createRequisites: $createRequisites,
};
