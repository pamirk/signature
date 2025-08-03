import { put, call, takeEvery, cancelled } from 'redux-saga/effects';
import DocumentApiService from 'Services/Api/Document';

import { getFormRequestContracts } from './actionCreators';

function* handleFormRequestContractsGet({
  payload,
  meta,
}: ReturnType<typeof getFormRequestContracts.request>) {
  try {
    const data = yield call(DocumentApiService.getFormRequestContracts, payload);

    yield put(getFormRequestContracts.success({ contracts: data }, meta));
  } catch (err) {
    yield put(getFormRequestContracts.failure(err, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getFormRequestContracts.cancel(undefined, meta));
    }
  }
}

export default [
  takeEvery(getFormRequestContracts.request, handleFormRequestContractsGet),
];
