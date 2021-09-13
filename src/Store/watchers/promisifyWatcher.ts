import { takeEvery, take, race, put, call, fork, cancel } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import {
  START_WATCH_PROMISIFIED_ACTION,
  STOP_WATCH_PROMISIFIED_ACTION,
} from 'Store/actionTypes';

const getPayload = action => (action && action.payload) || action;

function* finishTask(taskId) {
  yield put({
    type: STOP_WATCH_PROMISIFIED_ACTION,
    meta: { taskId },
  });
}

function* handleRoutineAction({
  success,
  failure,
  cancelAction,
  taskId,
  resolve,
  reject,
}) {
  const action = success || failure || cancelAction;

  if (!action) {
    yield cancel();
  }

  const isTargetTask = action.meta && action.meta.taskId === taskId;

  if (!isTargetTask) {
    if (action.meta.isLeading) {
      yield call(resolve);
      yield call(finishTask, taskId);
    }

    yield cancel();
  }

  if (success) {
    yield call(resolve, getPayload(success));
  } else if (failure) {
    yield call(reject, getPayload(failure));
  } else {
    yield call(resolve);
  }

  yield call(finishTask, taskId);
}

export function* handlePromisyAction(action) {
  const {
    payload,
    meta: {
      actionCreators,
      taskId,
      defer: { resolve, reject },
    },
  } = action;

  yield put(actionCreators.request(payload, { taskId }));

  while (true) {
    const { stopWatching, ...actionsTaken } = yield race({
      success: take(getType(actionCreators.success)),
      failure: take(getType(actionCreators.failure)),
      cancelAction: take(getType(actionCreators.cancel)),
      stopWatching: take(STOP_WATCH_PROMISIFIED_ACTION),
    });

    if (stopWatching && stopWatching.meta.taskId === taskId) {
      yield cancel();
    }

    yield fork(handleRoutineAction, {
      ...actionsTaken,
      taskId,
      resolve,
      reject,
    });
  }
}

export default function* routinePromiseWatcherSaga() {
  yield takeEvery(START_WATCH_PROMISIFIED_ACTION, handlePromisyAction);
}
