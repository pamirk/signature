import { deleteSignatureRequests } from './actionCreators';
import SignatureRequestApiService from 'Services/Api/SignatureRequest';
import { call, cancelled, put, takeLeading } from 'redux-saga/effects';

function* handleSignatureRequestsDelete({
  payload,
  meta,
}: ReturnType<typeof deleteSignatureRequests.request>) {
  try {
    yield call(
      SignatureRequestApiService.deleteSignatureRequests,
      payload.signatureRequestIds,
    );
    yield put(deleteSignatureRequests.success(undefined, meta));
  } catch (error) {
    yield put(deleteSignatureRequests.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(deleteSignatureRequests.cancel(undefined, meta));
    }
  }
}

export default [
  takeLeading(deleteSignatureRequests.request, handleSignatureRequestsDelete),
];
