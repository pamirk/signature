import { put, call, takeLatest, takeLeading, takeEvery } from 'redux-saga/effects';
import { getAuthUrl, getAuthToken, deactivate } from './actionCreators';
import IntegrationService from 'Services/Api/Integrations';
import {
  IntegrationUrlPayload,
  IntegrationAuthTokenPayload,
} from 'Interfaces/Integration';

function* handleAuthUrlGet({ payload, meta }: ReturnType<typeof getAuthUrl.request>) {
  try {
    const response: IntegrationUrlPayload = yield call(
      IntegrationService.getAuthUrl,
      payload,
    );

    yield put(getAuthUrl.success(response, meta));
  } catch (error:any) {
    yield put(getAuthUrl.failure(error, meta));
  } finally {
    yield put(getAuthUrl.cancel(undefined, meta));
  }
}

function* handleAuthTokenGet({ payload, meta }: ReturnType<typeof getAuthToken.request>) {
  try {
    const response: IntegrationAuthTokenPayload = yield call(
      IntegrationService.getAuthToken,
      payload,
    );

    yield put(getAuthToken.success(response, { ...meta, isLeading: true }));
  } catch (error:any) {
    yield put(getAuthToken.failure(error, { ...meta, isLeading: true }));
  } finally {
    yield put(getAuthToken.cancel(undefined, { ...meta, isLeading: true }));
  }
}

function* handleIntegrationDeactivate({
  payload,
  meta,
}: ReturnType<typeof deactivate.request>) {
  try {
    const response: IntegrationUrlPayload = yield call(
      IntegrationService.deactivate,
      payload,
    );

    yield put(deactivate.success({ ...response, ...payload }, meta));
  } catch (error:any) {
    yield put(deactivate.failure(error, meta));
  } finally {
    yield put(deactivate.cancel(undefined, meta));
  }
}

export default [
  takeLatest(getAuthUrl.request, handleAuthUrlGet),
  takeLeading(getAuthToken.request, handleAuthTokenGet),
  takeEvery(deactivate.request, handleIntegrationDeactivate),
];
