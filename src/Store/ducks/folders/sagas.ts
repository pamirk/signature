import { put, call, takeLeading, cancelled, takeEvery } from 'redux-saga/effects';
import lodash from 'lodash';
import {
  changePermissions,
  createFolder,
  deleteFolders,
  getFolder,
  getFolderInfo,
  updateFolder,
} from './actionCreators';
import FolderApi from 'Services/Api/Folder';
import { NormalizedEntity } from 'Interfaces/Common';
import { Folder } from 'Interfaces/Folder';

function* handleFolderCreate({ payload, meta }: ReturnType<typeof createFolder.request>) {
  try {
    const folder = yield call(FolderApi.createFolder, payload);

    yield put(createFolder.success(folder, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(createFolder.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(createFolder.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleFolderChangePermission({
  payload,
  meta,
}: ReturnType<typeof changePermissions.request>) {
  try {
    const folder = yield call(FolderApi.changePermissions, payload);
    yield put(changePermissions.success(folder, meta));
  } catch (error) {
    yield put(changePermissions.failure(error, meta));
  } finally {
    yield put(changePermissions.cancel(undefined, meta));
  }
}

function* handleFolderUpdate({ payload, meta }: ReturnType<typeof updateFolder.request>) {
  try {
    const folder = yield call(FolderApi.updateFolder, payload);
    yield put(updateFolder.success(folder, meta));
  } catch (error) {
    yield put(updateFolder.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(updateFolder.cancel(undefined, meta));
    }
  }
}

function* handleFoldersDelete({
  payload,
  meta,
}: ReturnType<typeof deleteFolders.request>) {
  try {
    yield call(FolderApi.deleteFolders, payload.folderIds);
    yield put(deleteFolders.success(undefined, meta));
  } catch (error) {
    yield put(deleteFolders.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(deleteFolders.cancel(undefined, meta));
    }
  }
}

function* handleFolderInfoGet({
  payload,
  meta,
}: ReturnType<typeof getFolderInfo.request>) {
  try {
    const folderInfo = yield call(FolderApi.getFolderInfo, payload);
    yield put(getFolderInfo.success(folderInfo, meta));
  } catch (error) {
    yield put(getFolderInfo.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getFolderInfo.cancel(undefined, meta));
    }
  }
}

function* handleFolderGet({ payload, meta }: ReturnType<typeof getFolder.request>) {
  try {
    const folders = yield call(FolderApi.getFolder, payload);
    const normalizedFolders: NormalizedEntity<Folder> = lodash.keyBy(folders, 'id');
    yield put(getFolder.success({ folders: normalizedFolders }, meta));
  } catch (error) {
    yield put(getFolder.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getFolder.cancel(undefined, meta));
    }
  }
}

export default [
  takeLeading(createFolder.request, handleFolderCreate),
  takeLeading(deleteFolders.request, handleFoldersDelete),
  takeEvery(changePermissions.request, handleFolderChangePermission),
  takeEvery(updateFolder.request, handleFolderUpdate),
  takeEvery(getFolderInfo.request, handleFolderInfoGet),
  takeEvery(getFolder.request, handleFolderGet),
];
