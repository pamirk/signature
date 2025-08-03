export enum FolderCreateActionTypes {
  request = 'folder/CREATE/REQUEST',
  success = 'folder/CREATE/SUCCESS',
  failure = 'folder/CREATE/FAILURE',
  cancel = 'folder/CREATE/CANCEL',
}

export enum FolderUpdateActionTypes {
  request = 'folder/UPDATE/REQUEST',
  success = 'folder/UPDATE/SUCCESS',
  failure = 'folder/UPDATE/FAILURE',
  cancel = 'folder/UPDATE/CANCEL',
}

export enum FoldersDeleteActionTypes {
  request = 'folders/DELETE/REQUEST',
  success = 'folders/DELETE/SUCCESS',
  failure = 'folders/DELETE/FAILURE',
  cancel = 'folders/DELETE/CANCEL',
}

export enum FolderInfoGetActionTypes {
  request = 'folderInfo/GET/REQUEST',
  success = 'folderInfo/GET/SUCCESS',
  failure = 'folderInfo/GET/FAILURE',
  cancel = 'folderInfo/GET/CANCEL',
}

export enum FolderGetActionTypes {
  request = 'folder/GET/REQUEST',
  success = 'folder/GET/SUCCESS',
  failure = 'folder/GET/FAILURE',
  cancel = 'folder/GET/CANCEL',
}

export enum FolderChangePermissionActionTypes {
  request = 'folder/CHANGE_PERMISSIONS/REQUEST',
  success = 'folder/CHANGE_PERMISSIONS/SUCCESS',
  failure = 'folder/CHANGE_PERMISSIONS/FAILURE',
  cancel = 'folder/CHANGE_PERMISSIONS/CANCEL',
}
