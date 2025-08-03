import { call, cancelled, put, takeLeading } from 'redux-saga/effects';
import { User } from 'Interfaces/User';
import UserApiService from 'Services/Api/User';
import { getCompanyInfo } from './actionCreators';
import {
  confirmEmail,
  confirmEmailByTwilio,
  getCurrentUser,
  ltdSignUp,
  signInAppSumoUser,
  signInGoogleAuthenticator,
  signInPrimary,
  signInTwillio,
  signUp,
} from '../user/actionCreators';
import { isUserResponseData } from 'Utils/typeGuards';
import { AuthResponseData } from 'Interfaces/Auth';
import { CurrentUserGetActionTypes } from '../user/actionTypes';

type GetCompanyTriggers =
  | typeof getCurrentUser.success
  | typeof signInAppSumoUser.success
  | typeof signInPrimary.success
  | typeof signInTwillio.success
  | typeof signInGoogleAuthenticator.success
  | typeof signUp.success
  | typeof confirmEmail.success
  | typeof confirmEmailByTwilio.success
  | typeof ltdSignUp.success;

function* handleCompanyInfoGet({ payload, meta, type }: ReturnType<GetCompanyTriggers>) {
  try {
    if (
      type === CurrentUserGetActionTypes.success ||
      isUserResponseData(payload as AuthResponseData)
    ) {
      const result: User = yield call(UserApiService.getCompanyInfo);
      yield put(getCompanyInfo.success(result, { ...meta, isLeading: true }));
    }
  } catch (error) {
    yield put(getCompanyInfo.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getCompanyInfo.cancel(undefined, meta));
    }
  }
}

function* handletCompanyInfoGetForcedly({
  meta,
}: ReturnType<typeof getCompanyInfo.request>) {
  try {
    const result: User = yield call(UserApiService.getCompanyInfo);
    yield put(getCompanyInfo.success(result, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getCompanyInfo.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getCompanyInfo.cancel(undefined, meta));
    }
  }
}

export default [
  takeLeading(getCurrentUser.success, handleCompanyInfoGet),
  takeLeading(signInAppSumoUser.success, handleCompanyInfoGet),
  takeLeading(signInPrimary.success, handleCompanyInfoGet),
  takeLeading(signInTwillio.success, handleCompanyInfoGet),
  takeLeading(signInGoogleAuthenticator.success, handleCompanyInfoGet),
  takeLeading(signUp.success, handleCompanyInfoGet),
  takeLeading(confirmEmail.success, handleCompanyInfoGet),
  takeLeading(confirmEmailByTwilio.success, handleCompanyInfoGet),
  takeLeading(ltdSignUp.success, handleCompanyInfoGet),
  takeLeading(getCompanyInfo.request, handletCompanyInfoGetForcedly),
];
