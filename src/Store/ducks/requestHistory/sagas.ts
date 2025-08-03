import { put, call, takeLatest, cancelled } from 'redux-saga/effects';
import lodash from 'lodash';
import Axios from 'axios';
import { NormalizedEntity } from 'Interfaces/Common';
import { getRequestHistory } from './actionCreators';
import RequestHistoryApi from 'Services/Api/RequestHistory';
import { RequestHistoryItem } from 'Interfaces/RequestsHistory';

function* handleRequestHistoryGet({
  payload,
  meta,
}: ReturnType<typeof getRequestHistory.request>) {
  const cancelToken = Axios.CancelToken.source();
  const { apiKeyId, ...restParams } = payload;
  try {
    const { items, totalItems, pageCount, itemCount } = yield call(
      RequestHistoryApi.getRequestHistory,
      restParams,
      apiKeyId,
      {
        cancelToken: cancelToken.token,
      },
    );
    const normalizedRequestHistory: NormalizedEntity<RequestHistoryItem> = lodash.keyBy(
      items,
      'id',
    );

    yield put(
      getRequestHistory.success(
        {
          requestHistory: normalizedRequestHistory,
          paginationData: { totalItems, pageCount, itemsCount: itemCount },
        },
        meta,
      ),
    );
  } catch (error) {
    yield put(getRequestHistory.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getRequestHistory.cancel(undefined, meta));
      cancelToken.cancel();
    }
  }
}

export default [takeLatest(getRequestHistory.request, handleRequestHistoryGet)];
