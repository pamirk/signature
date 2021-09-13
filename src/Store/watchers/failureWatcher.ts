import { takeEvery, put } from 'redux-saga/effects';
import { Action, PayloadMetaActionCreator } from 'typesafe-actions';
import { PromisifiedActionMeta } from 'Interfaces/ActionCreators';
import { HttpStatus } from 'Interfaces/HttpStatusEnum';
import {
  PrimarySignInActionTypes,
  SignInAppSumoUserActionTypes,
} from 'Store/ducks/user/actionTypes';
import { setUnauthorized, signInPrimary } from 'Store/ducks/user/actionCreators';

const failureRegex = /\/FAILURE/;

const failurePattern = (action: Action) => failureRegex.test(action.type);

interface Error {
  [key: string]: any;
  statusCode?: HttpStatus;
}

type FailureActionType = ReturnType<
  PayloadMetaActionCreator<string, Error, PromisifiedActionMeta>
>;

export function* handleFailureAction({ payload, type }: FailureActionType) {
  if (
    payload.statusCode === HttpStatus.UNAUTHORIZED &&
    type !== PrimarySignInActionTypes.failure &&
    type !== SignInAppSumoUserActionTypes.failure
  ) {
    yield put(setUnauthorized());
  }
}

export default function* routineFailureWatcherSaga() {
  yield takeEvery(failurePattern, handleFailureAction);
}
