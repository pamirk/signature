import {
  put,
  call,
  takeLeading,
  takeLatest,
  takeEvery,
  cancelled,
} from 'redux-saga/effects';
import lodash from 'lodash';
import Axios from 'axios';
import { NormalizedEntity } from 'Interfaces/Common';
import { ApiKey } from 'Interfaces/ApiKey';
import {
  createApiKey,
  getApiKeys,
  getApiKey,
  deleteApiKeys,
  deleteApiKey,
  revokeApiKey,
  recoverApiKey,
} from './actionCreators';
import ApiKeyApiService from 'Services/Api/ApiKeys';

function* handleApiKeysGet({ payload, meta }: ReturnType<typeof getApiKeys.request>) {
  const cancelToken = Axios.CancelToken.source();

  try {
    const { items, totalItems, pageCount, itemCount } = yield call(
      ApiKeyApiService.getApiKeys,
      payload,
      {
        cancelToken: cancelToken.token,
      },
    );
    const normalizedApiKeys: NormalizedEntity<ApiKey> = lodash.keyBy(items, 'id');

    yield put(
      getApiKeys.success(
        {
          apiKeys: normalizedApiKeys,
          paginationData: { totalItems, pageCount, itemsCount: itemCount },
        },
        meta,
      ),
    );
  } catch (error:any) {
    yield put(getApiKeys.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getApiKeys.cancel(undefined, meta));
      cancelToken.cancel();
    }
  }
}

function* handleApiKeyGet({ payload, meta }: ReturnType<typeof getApiKey.request>) {
  try {
    const apiKey: ApiKey = yield call(ApiKeyApiService.getApiKey, payload);
    yield put(getApiKey.success(apiKey, meta));
  } catch (error:any) {
    yield put(getApiKey.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getApiKey.cancel(undefined, meta));
    }
  }
}

function* handleApiKeyCreate({ payload, meta }: ReturnType<typeof createApiKey.request>) {
  try {
    const apiKey = yield call(ApiKeyApiService.createApiKey, payload);

    yield put(createApiKey.success(apiKey, { ...meta, isLeading: true }));
  } catch (error:any) {
    yield put(createApiKey.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(createApiKey.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleApiKeysDelete({
  payload,
  meta,
}: ReturnType<typeof deleteApiKeys.request>) {
  try {
    yield call(ApiKeyApiService.deleteApiKeys, payload.apiKeyIds);
    yield put(deleteApiKeys.success(undefined, meta));
  } catch (error:any) {
    yield put(deleteApiKeys.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(deleteApiKeys.cancel(undefined, meta));
    }
  }
}

function* handleApiKeyDelete({ payload, meta }: ReturnType<typeof deleteApiKey.request>) {
  try {
    yield call(ApiKeyApiService.deleteApiKey, payload);
    yield put(deleteApiKey.success(undefined, meta));
  } catch (error:any) {
    yield put(deleteApiKey.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(deleteApiKey.cancel(undefined, meta));
    }
  }
}

function* handleApiKeyRevoke({ payload, meta }: ReturnType<typeof revokeApiKey.request>) {
  try {
    const apiKey = yield call(ApiKeyApiService.revokeApiKey, payload);
    yield put(revokeApiKey.success(apiKey, meta));
  } catch (error:any) {
    yield put(revokeApiKey.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(revokeApiKey.cancel(undefined, meta));
    }
  }
}

function* handleApiKeyRecover({
  payload,
  meta,
}: ReturnType<typeof recoverApiKey.request>) {
  try {
    const apiKey = yield call(ApiKeyApiService.recoverApiKey, payload);
    yield put(recoverApiKey.success(apiKey, meta));
  } catch (error:any) {
    yield put(recoverApiKey.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(recoverApiKey.cancel(undefined, meta));
    }
  }
}

export default [
  takeLatest(getApiKeys.request, handleApiKeysGet),
  takeLatest(deleteApiKey.request, handleApiKeyDelete),
  takeLatest(revokeApiKey.request, handleApiKeyRevoke),
  takeLatest(recoverApiKey.request, handleApiKeyRecover),
  takeEvery(getApiKey.request, handleApiKeyGet),
  takeLeading(createApiKey.request, handleApiKeyCreate),
  takeLeading(deleteApiKeys.request, handleApiKeysDelete),
];
