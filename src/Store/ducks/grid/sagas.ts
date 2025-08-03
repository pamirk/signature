import { put, call, takeLeading, cancelled, takeEvery } from 'redux-saga/effects';
import lodash from 'lodash';
import { NormalizedEntity } from 'Interfaces/Common';
import {
  deleteGridItems,
  emptyTrash,
  getGrid,
  getGridForSignatureRequests,
  moveToTrashGridItems,
  updateGrid,
} from './actionCreators';
import GridApi from 'Services/Api/Grid';
import { GridEntityType, GridItem } from 'Interfaces/Grid';
import Axios from 'axios';

function* handleGridGet({ payload, meta }: ReturnType<typeof getGrid.request>) {
  const cancelToken = Axios.CancelToken.source();

  try {
    const { items, totalItems, pageCount, itemCount } = yield call(
      GridApi.getGrid,
      payload,
      {
        cancelToken: cancelToken.token,
      },
    );

    const normalizedGrid: NormalizedEntity<GridItem> = lodash.keyBy(items, 'entityId');
    yield put(
      getGrid.success(
        {
          grid: normalizedGrid,
          paginationData: { totalItems, pageCount, itemsCount: itemCount },
        },
        meta,
      ),
    );
  } catch (error) {
    yield put(getGrid.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getGrid.cancel(undefined, meta));
      cancelToken.cancel();
    }
  }
}

function* handleGridGetForSignatureRequests({
  payload,
  meta,
}: ReturnType<typeof getGridForSignatureRequests.request>) {
  const cancelToken = Axios.CancelToken.source();

  try {
    const { items, totalItems, pageCount, itemCount } = yield call(
      GridApi.getGridForSignatureRequests,
      payload,
      {
        cancelToken: cancelToken.token,
      },
    );

    const signatureRequestItems = items.map(item => ({
      ...item,
      documents:
        item.entityType === GridEntityType.SIGNATURE_REQUEST &&
        item.signatureRequests.documents,
    }));

    const normalizedGrid: NormalizedEntity<GridItem> = lodash.keyBy(
      signatureRequestItems,
      'entityId',
    );
    yield put(
      getGridForSignatureRequests.success(
        {
          grid: normalizedGrid,
          paginationData: { totalItems, pageCount, itemsCount: itemCount },
        },
        meta,
      ),
    );
  } catch (error) {
    yield put(getGridForSignatureRequests.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getGridForSignatureRequests.cancel(undefined, meta));
      cancelToken.cancel();
    }
  }
}

function* handleGridUpdate({ payload, meta }: ReturnType<typeof updateGrid.request>) {
  try {
    const folder = yield call(GridApi.updateGrid, payload);
    yield put(updateGrid.success(folder, meta));
  } catch (error) {
    yield put(updateGrid.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(updateGrid.cancel(undefined, meta));
    }
  }
}

function* handleGridItemsDelete({
  payload,
  meta,
}: ReturnType<typeof deleteGridItems.request>) {
  try {
    yield call(GridApi.deleteGridItems, payload.entityIds);
    yield put(deleteGridItems.success(undefined, meta));
  } catch (error) {
    yield put(deleteGridItems.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(deleteGridItems.cancel(undefined, meta));
    }
  }
}

function* handleGridItemsMoveToTrash({
  payload,
  meta,
}: ReturnType<typeof moveToTrashGridItems.request>) {
  try {
    yield call(GridApi.moveToTrashGridItems, payload.entityIds);
    yield put(moveToTrashGridItems.success(undefined, meta));
  } catch (error) {
    yield put(moveToTrashGridItems.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(moveToTrashGridItems.cancel(undefined, meta));
    }
  }
}

function* handleTrashEmpty({ meta }: ReturnType<typeof emptyTrash.request>) {
  try {
    yield call(GridApi.emptyTrash);
    yield put(emptyTrash.success(undefined, meta));
  } catch (error) {
    yield put(emptyTrash.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(emptyTrash.cancel(undefined, meta));
    }
  }
}

export default [
  takeEvery(updateGrid.request, handleGridUpdate),
  takeEvery(getGrid.request, handleGridGet),
  takeEvery(getGridForSignatureRequests.request, handleGridGetForSignatureRequests),
  takeLeading(deleteGridItems.request, handleGridItemsDelete),
  takeLeading(moveToTrashGridItems.request, handleGridItemsMoveToTrash),
  takeLeading(emptyTrash.request, handleTrashEmpty),
];
