import sagas from './sagas';
import {
  createFolder,
  updateFolder,
  changePermissions,
  $createFolder,
  $updateFolder,
  deleteFolders,
  $deleteFolders,
  getFolderInfo,
  $getFolderInfo,
  getFolder,
  $getFolder,
  $changePermissions,
} from './actionCreators';
import reducer from './reducer';

export default {
  sagas,
  reducer,
  actions: {
    createFolder,
    changePermissions,
    updateFolder,
    deleteFolders,
    getFolderInfo,
    getFolder,
  },
};

export const $actions = {
  createFolder: $createFolder,
  changePermissions: $changePermissions,
  updateFolder: $updateFolder,
  deleteFolders: $deleteFolders,
  getFolderInfo: $getFolderInfo,
  getFolder: $getFolder,
};
