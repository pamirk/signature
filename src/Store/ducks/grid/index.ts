import sagas from './sagas';
import {
  getGrid,
  $getGrid,
  updateGrid,
  $updateGrid,
  deleteGridItems,
  $deleteGridItems,
  getGridForSignatureRequests,
  $getGridForSignatureRequests,
  moveToTrashGridItems,
  $moveToTrashGridItems,
  emptyTrash,
  $emptyTrash,
} from './actionCreators';
import reducer from './reducer';

export default {
  sagas,
  reducer,
  actions: {
    getGrid,
    updateGrid,
    deleteGridItems,
    getGridForSignatureRequests,
    moveToTrashGridItems,
    emptyTrash,
  },
};

export const $actions = {
  getGrid: $getGrid,
  updateGrid: $updateGrid,
  deleteGridItems: $deleteGridItems,
  getGridForSignatureRequests: $getGridForSignatureRequests,
  moveToTrashGridItems: $moveToTrashGridItems,
  emptyTrash: $emptyTrash,
};
