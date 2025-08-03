import { createReducer } from 'typesafe-actions';
import { NormalizedEntity } from 'Interfaces/Common';
import {
  changePermissions,
  createFolder,
  getFolder,
  getFolderInfo,
  updateFolder,
} from './actionCreators';

import { Folder, FolderInfo } from 'Interfaces/Folder';

export default createReducer({} as NormalizedEntity<Folder | FolderInfo>)
  .handleAction(
    [
      createFolder.success,
      updateFolder.success,
      getFolderInfo.success,
      changePermissions.success,
    ],
    (state, action) => ({
      ...state,
      [action.payload.id]: action.payload,
    }),
  )
  .handleAction(getFolder.success, (state, action) => ({
    ...action.payload.folders,
  }));
