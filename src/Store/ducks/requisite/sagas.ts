import { put, call, select, takeLatest, cancelled, takeEvery } from 'redux-saga/effects';
import { keyBy } from 'lodash';
import RequisiteApiService from 'Services/Api/Requisite';
import ApiService from 'Services/Api/Api';
import { Requisite, RequisiteSiblings } from 'Interfaces/Requisite';
import { AxiosRequestConfig } from 'axios';
import { NormalizedEntity } from 'Interfaces/Common';
import { selectSignToken } from 'Utils/selectors';
import { UserReducerState } from '../user/reducer';
import {
  deleteRequisite,
  getRequisites,
  createRequisites,
  updateRequisites,
  downloadFileByUrl,
} from './actionCreators';

function* handleRequisitesGet({ meta }: ReturnType<typeof getRequisites.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const requisitesList: Requisite[] = yield call(RequisiteApiService.getRequisites, {
      token,
      payload: { withDeleted: false },
    });
    const normalizedRequisites: NormalizedEntity<Requisite> = keyBy(requisitesList, 'id');
    yield put(getRequisites.success(normalizedRequisites, meta));
  } catch (error) {
    yield put(getRequisites.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getRequisites.cancel(undefined, meta));
    }
  }
}

function* handleRequisiteDelete({
  meta,
  payload,
}: ReturnType<typeof deleteRequisite.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const requisites: RequisiteSiblings = yield call(
      RequisiteApiService.deleteRequisite,
      {
        token,
        payload,
      },
    );
    yield put(deleteRequisite.success(requisites, meta));
  } catch (error) {
    yield put(deleteRequisite.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(deleteRequisite.cancel(undefined, meta));
    }
  }
}

function* handleRequisitesCreate({
  meta,
  payload,
}: ReturnType<typeof createRequisites.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const requisites: RequisiteSiblings = yield call(
      RequisiteApiService.createRequisites,
      {
        token,
        payload,
      },
    );
    yield put(createRequisites.success(requisites, meta));
  } catch (error) {
    yield put(createRequisites.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(createRequisites.cancel(undefined, meta));
    }
  }
}

function* handleRequisitesUpdate({
  meta,
  payload,
}: ReturnType<typeof updateRequisites.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const requisites: RequisiteSiblings = yield call(
      RequisiteApiService.updateRequisites,
      {
        token,
        payload,
      },
    );
    yield put(updateRequisites.success(requisites, meta));
  } catch (error) {
    yield put(updateRequisites.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(updateRequisites.cancel(undefined, meta));
    }
  }
}

function* handleDownloadFileByUrl({
  payload,
  meta,
}: ReturnType<typeof downloadFileByUrl.request>) {
  try {
    const config: AxiosRequestConfig = { responseType: 'blob' };
    const { data } = yield call(ApiService.downloadFile, payload, config);
    yield put(downloadFileByUrl.success(data, meta));
  } catch (error) {
    yield put(downloadFileByUrl.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(downloadFileByUrl.cancel(undefined, meta));
    }
  }
}

export default [
  takeLatest(getRequisites.request, handleRequisitesGet),
  takeLatest(deleteRequisite.request, handleRequisiteDelete),
  takeLatest(createRequisites.request, handleRequisitesCreate),
  takeLatest(updateRequisites.request, handleRequisitesUpdate),
  takeEvery(downloadFileByUrl.request, handleDownloadFileByUrl),
];
