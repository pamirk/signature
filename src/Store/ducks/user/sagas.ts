/* eslint-disable */
import {
  put,
  call,
  select,
  takeLeading,
  cancelled,
  takeEvery,
  takeLatest,
  cancel,
} from 'redux-saga/effects';
import lodash from 'lodash';
import AuthApiService from 'Services/Api/Auth';
import UserApiService from 'Services/Api/User';
import StorageService from 'Services/Storage';
import SocketService from 'Services/Socket';
import {
  AuthResponseData,
  CodeConfirmationData,
  TemporaryUserResponseData,
} from 'Interfaces/Auth';
import {
  isEmailConfirmationData,
  isTwoFactorResponseData,
  isUserResponseData,
} from 'Utils/typeGuards';
import {
  signIn,
  signInPrimary,
  signInGoogleAuthenticator,
  signUp,
  logout,
  getSignedGetUrl,
  getSignedGetUrlHash,
  getSignedGetUrlBulk,
  getSignedPutUrl,
  connectSocket,
  disconnectSocket,
  getCurrentUser,
  putRequisite,
  updateProfileInfo,
  deleteAccount,
  verifyPhone,
  generateCode,
  joinSocketRoom,
  disableTwillio2fa,
  getSignedGetDownloadUrl,
  updateCompanyInfo,
  putCompanyLogo,
  signInTwillio,
  setTwoFactor,
  disableGoogleAuthenticator,
  verifyGoogleCode,
  enableGoogleAuthenticator,
  sendPasswordChangeEmail,
  changePassword,
  subscribeOnAPIUpdates,
  unsubscribeFromAPIUpdates,
  confirmEmail,
  setEmailConfirmationData,
  sendConformationEmail,
  signInAppSumoUser,
  getSignedPutAssetUrl,
  putAvatar,
  getSignersAvatars,
  signUpWithPlanPrepare,
  signUpWithConfirmCode,
  updateEmail,
  setIsEmailConfirmed,
  updateGoogleClientId,
  signOut,
  setUnauthorized,
  getEmbedSignedUrlBulk,
  getCompatibleSignedGetUrl,
  confirmEmailByTwilio,
  ltdSignUp,
  signUpTemporary,
  signUpFromTemporary,
  confirmTemporary,
} from './actionCreators';
import { User, UserAvatar } from 'Interfaces/User';
import {
  SignedUrlResponse,
  UploadStatuses,
  BulkSignedUrlResponse,
} from 'Interfaces/Common';
import AWS from 'Services/AWS';
import { UserReducerState } from './reducer';
import {
  selectSignToken,
  selectEmailToken,
  selectUser,
  selectTwoFactorToken,
  selectPasswordToken,
  selectEmbedToken,
} from 'Utils/selectors';
import { DataLayerAnalytics } from 'Services/Integrations';
import { isNotEmpty, redirectToUserWorkflowVersion } from 'Utils/functions';

function* handleSignIn(response: AuthResponseData) {
  if (isUserResponseData(response)) {
    const { user } = response;

    if (user.id) {
      redirectToUserWorkflowVersion(user.workflowVersion);
      DataLayerAnalytics.fireUserIdEvent(response.user);
    }

    yield put(signIn(user));
  } else if (isEmailConfirmationData(response)) {
    yield put(setEmailConfirmationData(response));
  } else {
    yield put(setTwoFactor(response));
  }
}

function* handleAppSumoSignIn({
  payload,
  meta,
}: ReturnType<typeof signInAppSumoUser.request>) {
  const { token } = payload;

  try {
    const res = yield call(AuthApiService.appSumoSignIn, token);
    yield call(handleSignIn, res);
    yield put(signInAppSumoUser.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(signInAppSumoUser.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(signInAppSumoUser.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleSignInPrimary({
  payload,
  meta,
}: ReturnType<typeof signInPrimary.request>) {
  const { values } = payload;

  try {
    let res: AuthResponseData;

    if (values.id_token) {
      res = yield call(AuthApiService.googleSignIn, values);
    } else {
      res = yield call(AuthApiService.signIn, values);
    }

    yield call(handleSignIn, res);
    yield put(signInPrimary.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(signInPrimary.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(signInPrimary.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleSignInTwillio({
  payload,
  meta,
}: ReturnType<typeof signInTwillio.request>) {
  try {
    const token: UserReducerState['twoFactorToken'] = yield select(selectTwoFactorToken);
    const res: AuthResponseData = yield call(AuthApiService.signInTwillio, {
      payload,
      token,
    });

    yield call(handleSignIn, res);
    yield put(signInTwillio.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(signInTwillio.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(signInTwillio.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleSignInGoogleAuthenticator({
  payload,
  meta,
}: ReturnType<typeof signInGoogleAuthenticator.request>) {
  try {
    const token: UserReducerState['twoFactorToken'] = yield select(selectTwoFactorToken);

    const res: AuthResponseData = yield call(AuthApiService.signInGoogleAuthenticator, {
      payload,
      token,
    });

    yield call(handleSignIn, res);
    yield put(signInGoogleAuthenticator.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(signInGoogleAuthenticator.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(
        signInGoogleAuthenticator.cancel(undefined, { ...meta, isLeading: true }),
      );
    }
  }
}

function* handleSignUp({ payload, meta }: ReturnType<typeof signUp.request>) {
  const { values } = payload;

  try {
    let res: AuthResponseData;

    if (values.id_token) {
      res = yield call(AuthApiService.googleSignIn, values);
    } else {
      res = yield call(AuthApiService.signUp, values);
    }
    yield call(handleSignIn, res);
    yield put(signUp.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(signUp.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(signUp.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleSignUpTemporary({ meta }: ReturnType<typeof signUpTemporary.request>) {
  try {
    const res: TemporaryUserResponseData = yield call(AuthApiService.signUpTemporary);

    StorageService.setAccessToken(res.accessToken);

    yield put(signUpTemporary.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(signUpTemporary.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(signUpTemporary.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleSignUpFromTemporary({
  payload,
  meta,
}: ReturnType<typeof signUpFromTemporary.request>) {
  try {
    const res: TemporaryUserResponseData = yield call(
      AuthApiService.signUpFromTemporary,
      payload,
    );

    if (res.accessToken) {
      StorageService.setAccessToken(res.accessToken);
    }

    yield put(signUpFromTemporary.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(signUpFromTemporary.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(signUpFromTemporary.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleConfirmTemporary({
  payload,
  meta,
}: ReturnType<typeof confirmTemporary.request>) {
  try {
    const res: User = yield call(AuthApiService.confirmTemporary, payload);

    StorageService.removeAccessToken();

    yield put(confirmTemporary.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(confirmTemporary.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(confirmTemporary.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleEmailConfirm({ meta }: ReturnType<typeof confirmEmail.request>) {
  try {
    const token: UserReducerState['emailToken'] = yield select(selectEmailToken);

    const res: AuthResponseData = yield call(AuthApiService.confirmEmail, token);

    if (isNotEmpty(res) && !isTwoFactorResponseData(res)) {
      yield put(setIsEmailConfirmed(true));
    }

    yield call(handleSignIn, res);
    yield put(confirmEmail.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(confirmEmail.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(confirmEmail.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleEmailConfirmByTwilio({
  payload,
  meta,
}: ReturnType<typeof confirmEmailByTwilio.request>) {
  try {
    const token: UserReducerState['twoFactorToken'] = yield select(selectTwoFactorToken);

    const res: AuthResponseData = yield call(AuthApiService.confirmEmailByTwilio, {
      payload,
      token,
    });

    yield put(setIsEmailConfirmed(true));
    yield call(handleSignIn, res);
    yield put(confirmEmailByTwilio.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(confirmEmailByTwilio.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(confirmEmailByTwilio.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleConfirmationEmailSend({
  meta,
  payload,
}: ReturnType<typeof sendConformationEmail.request>) {
  try {
    yield call(AuthApiService.sendConformationEmail, payload);

    yield put(sendConformationEmail.success(undefined, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(sendConformationEmail.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(sendConformationEmail.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleLogout() {
  yield StorageService.removeAccessToken();
}

function* handleLogoutRequest({ meta }: ReturnType<typeof signOut.request>) {
  try {
    yield call(AuthApiService.signOut);

    yield put(signOut.success(undefined, { ...meta, isLeading: true }));
    yield put(setUnauthorized());
  } catch (error) {
    yield put(signOut.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(signOut.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleCurrentUserGet({ meta }: ReturnType<typeof getCurrentUser.request>) {
  try {
    const result: User = yield call(UserApiService.getUser);
    yield put(getCurrentUser.success(result, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getCurrentUser.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getCurrentUser.cancel(undefined, meta));
    }
  }
}

function* handleSignedGetUrlGet({
  payload,
  meta,
}: ReturnType<typeof getSignedGetUrl.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const data: SignedUrlResponse = yield call(AuthApiService.getSignedGetUrl, {
      token,
      payload,
    });

    yield put(getSignedGetUrl.success(data, meta));
  } catch (error) {
    yield put(getSignedGetUrl.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSignedGetUrl.cancel(undefined, meta));
    }
  }
}

function* handleCompatibleSignedUrlGet({
  payload,
  meta,
}: ReturnType<typeof getCompatibleSignedGetUrl.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const data: SignedUrlResponse = yield call(AuthApiService.getCompatibleSignedGetUrl, {
      token,
      payload,
    });

    yield put(getCompatibleSignedGetUrl.success(data, meta));
  } catch (error) {
    yield put(getCompatibleSignedGetUrl.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getCompatibleSignedGetUrl.cancel(undefined, meta));
    }
  }
}

function* handleSignedGetUrlGetHash({
  payload,
  meta,
}: ReturnType<typeof getSignedGetUrlHash.request>) {
  try {
    const data: SignedUrlResponse = yield call(
      AuthApiService.getSignedGetUrlHash,
      payload,
    );

    yield put(getSignedGetUrlHash.success(data, meta));
  } catch (error) {
    yield put(getSignedGetUrlHash.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSignedGetUrlHash.cancel(undefined, meta));
    }
  }
}

function* handleSignedGetUrlBulkGet({
  payload,
  meta,
}: ReturnType<typeof getSignedGetUrlBulk.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const data: BulkSignedUrlResponse = yield call(AuthApiService.getSignedGetUrlBulk, {
      token,
      payload,
    });

    yield put(getSignedGetUrlBulk.success(data, meta));
  } catch (error) {
    yield put(getSignedGetUrlBulk.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSignedGetUrlBulk.cancel(undefined, meta));
    }
  }
}

function* handleSignedGetDownloadUrlGet({
  payload,
  meta,
}: ReturnType<typeof getSignedGetDownloadUrl.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    const data: SignedUrlResponse = yield call(AuthApiService.getSignedDownloadUrl, {
      token,
      payload,
    });

    yield put(getSignedGetDownloadUrl.success(data, meta));
  } catch (error) {
    yield put(getSignedGetDownloadUrl.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSignedGetDownloadUrl.cancel(undefined, meta));
    }
  }
}

function* handleSignedPutUrlGet({
  payload,
  meta,
}: ReturnType<typeof getSignedPutUrl.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);
    const data: SignedUrlResponse = yield call(AuthApiService.getSignedPutUrl, {
      token,
      payload,
    });

    yield put(getSignedPutUrl.success(data, meta));
  } catch (error) {
    yield put(getSignedPutUrl.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSignedPutUrl.cancel(undefined, meta));
    }
  }
}

function* handleSignedPutAssetUrlGet({
  payload,
  meta,
}: ReturnType<typeof getSignedPutAssetUrl.request>) {
  try {
    const data: SignedUrlResponse = yield call(
      AuthApiService.getSignedPutAssetUrl,
      payload,
    );

    yield put(getSignedPutAssetUrl.success(data, meta));
  } catch (error) {
    yield put(getSignedPutAssetUrl.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getSignedPutAssetUrl.cancel(undefined, meta));
    }
  }
}

function* handleRequisitePut({ payload, meta }: ReturnType<typeof putRequisite.request>) {
  try {
    yield call(AWS.putFile, payload);
    yield put(putRequisite.success(undefined, meta));
  } catch (error) {
    yield put(putRequisite.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(putRequisite.cancel(undefined, meta));
    }
  }
}

function* handleCompanyLogoPut({
  payload,
  meta,
}: ReturnType<typeof putCompanyLogo.request>) {
  try {
    const result = yield call(AWS.putFile, payload);

    if (result && result.status === UploadStatuses.CANCELLED) {
      yield cancel();
    }

    yield put(putCompanyLogo.success(UploadStatuses.UPLOADED, meta));
  } catch (error) {
    yield put(putCompanyLogo.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(putCompanyLogo.cancel(undefined, meta));
    }
  }
}

function* handleAvatarPut({ payload, meta }: ReturnType<typeof putAvatar.request>) {
  try {
    const result = yield call(AWS.putFile, payload);

    if (result && result.status === UploadStatuses.CANCELLED) {
      yield cancel();
    }

    yield put(putAvatar.success(UploadStatuses.UPLOADED, meta));
  } catch (error) {
    yield put(putAvatar.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(putAvatar.cancel(undefined, meta));
    }
  }
}

function* handleProfileInfoUpdate({
  payload,
  meta,
}: ReturnType<typeof updateProfileInfo.request>) {
  try {
    const result: User = yield call(UserApiService.updateProfileInfo, payload);

    yield put(updateProfileInfo.success(result, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(updateProfileInfo.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(updateProfileInfo.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleCompanyInfoUpdate({
  payload,
  meta,
}: ReturnType<typeof updateCompanyInfo.request>) {
  try {
    const result: User = yield call(UserApiService.updateCompanyInfo, payload);

    yield put(updateCompanyInfo.success(result, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(updateCompanyInfo.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(updateCompanyInfo.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleAccountDelete({ meta }: ReturnType<typeof deleteAccount.request>) {
  try {
    yield call(UserApiService.deleteAccount);

    yield put(deleteAccount.success(undefined, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(deleteAccount.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(deleteAccount.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleCodeGenerate({ meta, payload }: ReturnType<typeof generateCode.request>) {
  try {
    yield call(UserApiService.generateCode, payload);

    yield put(generateCode.success(undefined, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(generateCode.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(generateCode.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handlePhoneVerify({ meta, payload }: ReturnType<typeof verifyPhone.request>) {
  try {
    const user: User = yield call(UserApiService.verifyPhone, payload);

    yield put(verifyPhone.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(verifyPhone.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(verifyPhone.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleTwillioDisable({
  meta,
  payload,
}: ReturnType<typeof disableTwillio2fa.request>) {
  try {
    const user: User = yield call(UserApiService.disableTwillio2fa, payload);

    yield put(disableTwillio2fa.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(disableTwillio2fa.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(disableTwillio2fa.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGoogleAuthenticatorDisable({
  meta,
  payload,
}: ReturnType<typeof disableGoogleAuthenticator.request>) {
  try {
    const user: User = yield call(UserApiService.disableGoogleAuthenticator, payload);

    yield put(disableGoogleAuthenticator.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(disableGoogleAuthenticator.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(
        disableGoogleAuthenticator.cancel(undefined, { ...meta, isLeading: true }),
      );
    }
  }
}

function* handleGoogleCodeVerify({
  meta,
  payload,
}: ReturnType<typeof verifyGoogleCode.request>) {
  try {
    const user: User = yield call(UserApiService.verifyGoogleCode, payload);

    yield put(verifyGoogleCode.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(verifyGoogleCode.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(verifyGoogleCode.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGoogleAuthenticatorEnable({
  meta,
}: ReturnType<typeof enableGoogleAuthenticator.request>) {
  try {
    const qrCode: Blob = yield call(UserApiService.enableGoogleAuthenticator);

    yield put(enableGoogleAuthenticator.success(qrCode, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(enableGoogleAuthenticator.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(
        enableGoogleAuthenticator.cancel(undefined, { ...meta, isLeading: true }),
      );
    }
  }
}

function* handlePasswordChangeEmailSend({
  payload,
  meta,
}: ReturnType<typeof sendPasswordChangeEmail.request>) {
  try {
    yield call(AuthApiService.sendPasswordChangeEmail, payload);

    yield put(sendPasswordChangeEmail.success(undefined, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(sendPasswordChangeEmail.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(sendPasswordChangeEmail.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleEmailUpdate({ payload, meta }: ReturnType<typeof updateEmail.request>) {
  try {
    const user: User = yield call(AuthApiService.updateEmail, payload);

    yield put(updateEmail.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(updateEmail.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(updateEmail.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handlePasswordChange({
  payload,
  meta,
}: ReturnType<typeof changePassword.request>) {
  try {
    const token: UserReducerState['passwordToken'] = yield select(selectPasswordToken);
    yield call(AuthApiService.changePassword, { token, payload });
    yield put(changePassword.success(undefined, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(changePassword.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(changePassword.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleSocketConnect({ payload }: ReturnType<typeof connectSocket>) {
  yield call(SocketService.connect);

  if (payload.onConnect) {
    yield call(payload.onConnect);
  }

  if (payload.onReconnect) {
    yield call(SocketService.on, 'reconnect', payload.onReconnect);
  }
}

function* handleSocketDisconnect() {
  yield call(SocketService.disconnect);
}

function* handleSocketRoomJoin() {
  try {
    const user: User = yield select(selectUser);

    yield call(SocketService.joinRoom, user.id);
  } catch (err) {
    console.error('Socket room join error', err);
  }
}

function* handleAPIUpdatesSubscribeOn({
  meta,
}: ReturnType<typeof subscribeOnAPIUpdates.request>) {
  try {
    const user: User = yield call(UserApiService.subscribeToAPIUpdates);

    yield put(subscribeOnAPIUpdates.success(user, { isLeading: true, ...meta }));
  } catch (err) {
    yield put(subscribeOnAPIUpdates.failure(err, { isLeading: true, ...meta }));
  }
}

function* handleAPIUpdatesUnsubscribeFrom({
  meta,
}: ReturnType<typeof unsubscribeFromAPIUpdates.request>) {
  try {
    const user: User = yield call(UserApiService.unsubscribeFromAPIUpdates);

    yield put(unsubscribeFromAPIUpdates.success(user, { isLeading: true, ...meta }));
  } catch (err) {
    yield put(unsubscribeFromAPIUpdates.failure(err, { isLeading: true, ...meta }));
  }
}

function* handleSignersAvatarsGet({
  payload,
  meta,
}: ReturnType<typeof getSignersAvatars.request>) {
  try {
    const userAvatars: UserAvatar[] = yield call(
      UserApiService.getSignersAvatars,
      payload,
    );

    const normalizedAvatars = lodash.keyBy(userAvatars, 'id');

    yield put(getSignersAvatars.success(normalizedAvatars, { isLeading: true, ...meta }));
  } catch (err) {
    yield put(getSignersAvatars.failure(err, { isLeading: true, ...meta }));
  }
}

function* handleSignUpPrepare({
  payload,
  meta,
}: ReturnType<typeof signUpWithPlanPrepare.request>) {
  const { values } = payload;

  try {
    const res: CodeConfirmationData = yield call(
      AuthApiService.signUpWithPlanPrepare,
      values,
    );

    yield put(signUpWithPlanPrepare.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(signUpWithPlanPrepare.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(signUpWithPlanPrepare.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleSignUpWithConfrimCode({
  payload,
  meta,
}: ReturnType<typeof signUpWithConfirmCode.request>) {
  const { confirmCode, userId } = payload;

  try {
    const res = yield call(AuthApiService.signUpWithConfirmCode, {
      confirmCode,
      userId,
    });

    yield put(signUpWithConfirmCode.success(res, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(signUpWithConfirmCode.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(signUpWithConfirmCode.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGoogleClientIdUpdate({
  payload,
  meta,
}: ReturnType<typeof updateGoogleClientId.request>) {
  try {
    const user: User = yield call(UserApiService.updateGoogleClientId, payload);
    yield put(updateGoogleClientId.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(updateGoogleClientId.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(updateGoogleClientId.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleEmbedSignedUrlBulkGet({
  payload,
  meta,
}: ReturnType<typeof getEmbedSignedUrlBulk.request>) {
  try {
    const token: UserReducerState['embedToken'] = yield select(selectEmbedToken);

    const data: BulkSignedUrlResponse = yield call(AuthApiService.getSignedGetUrlBulk, {
      token,
      payload,
    });

    yield put(getEmbedSignedUrlBulk.success(data, meta));
  } catch (error) {
    yield put(getEmbedSignedUrlBulk.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getEmbedSignedUrlBulk.cancel(undefined, meta));
    }
  }
}

function* handleLtdSignUp({ payload, meta }: ReturnType<typeof ltdSignUp.request>) {
  const { values } = payload;

  try {
    const response: AuthResponseData = yield call(AuthApiService.ltdSignUp, values);

    yield call(handleSignIn, response);
    yield put(ltdSignUp.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(ltdSignUp.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(ltdSignUp.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

export default [
  takeLeading(signInPrimary.request, handleSignInPrimary),
  takeLeading(signInAppSumoUser.request, handleAppSumoSignIn),
  takeLeading(signInTwillio.request, handleSignInTwillio),
  takeLeading(signInGoogleAuthenticator.request, handleSignInGoogleAuthenticator),
  takeLeading(getSignersAvatars.request, handleSignersAvatarsGet),
  takeLeading(signUp.request, handleSignUp),
  takeLeading(signUpTemporary.request, handleSignUpTemporary),
  takeLeading(signUpFromTemporary.request, handleSignUpFromTemporary),
  takeLeading(confirmTemporary.request, handleConfirmTemporary),
  takeLeading(ltdSignUp.request, handleLtdSignUp),
  takeLeading(confirmEmail.request, handleEmailConfirm),
  takeLeading(confirmEmailByTwilio.request, handleEmailConfirmByTwilio),
  takeLeading(sendConformationEmail.request, handleConfirmationEmailSend),
  takeLeading(logout, handleLogout),
  takeLeading(signOut.request, handleLogoutRequest),
  takeLeading(getCurrentUser.request, handleCurrentUserGet),
  takeEvery(getSignedGetUrl.request, handleSignedGetUrlGet),
  takeEvery(getCompatibleSignedGetUrl.request, handleCompatibleSignedUrlGet),
  takeEvery(getSignedGetUrlHash.request, handleSignedGetUrlGetHash),
  takeEvery(getSignedGetUrlBulk.request, handleSignedGetUrlBulkGet),
  takeEvery(getSignedGetDownloadUrl.request, handleSignedGetDownloadUrlGet),
  takeEvery(getSignedPutUrl.request, handleSignedPutUrlGet),
  takeEvery(getSignedPutAssetUrl.request, handleSignedPutAssetUrlGet),
  takeEvery(putRequisite.request, handleRequisitePut),
  takeEvery(putCompanyLogo.request, handleCompanyLogoPut),
  takeEvery(putAvatar.request, handleAvatarPut),
  takeLatest(connectSocket, handleSocketConnect),
  takeLatest(disconnectSocket, handleSocketDisconnect),
  takeLatest(joinSocketRoom, handleSocketRoomJoin),
  takeLeading(updateProfileInfo.request, handleProfileInfoUpdate),
  takeLeading(updateEmail.request, handleEmailUpdate),
  takeLeading(updateCompanyInfo.request, handleCompanyInfoUpdate),
  takeLeading(generateCode.request, handleCodeGenerate),
  takeLeading(verifyPhone.request, handlePhoneVerify),
  takeLeading(disableGoogleAuthenticator.request, handleGoogleAuthenticatorDisable),
  takeLeading(enableGoogleAuthenticator.request, handleGoogleAuthenticatorEnable),
  takeLeading(verifyGoogleCode.request, handleGoogleCodeVerify),
  takeLeading(disableTwillio2fa.request, handleTwillioDisable),
  takeLeading(deleteAccount.request, handleAccountDelete),
  takeLeading(sendPasswordChangeEmail.request, handlePasswordChangeEmailSend),
  takeLeading(changePassword.request, handlePasswordChange),
  takeLeading(subscribeOnAPIUpdates.request, handleAPIUpdatesSubscribeOn),
  takeLeading(unsubscribeFromAPIUpdates.request, handleAPIUpdatesUnsubscribeFrom),
  takeLeading(signUpWithPlanPrepare.request, handleSignUpPrepare),
  takeLeading(signUpWithConfirmCode.request, handleSignUpWithConfrimCode),
  takeLeading(updateGoogleClientId.request, handleGoogleClientIdUpdate),
  takeEvery(getEmbedSignedUrlBulk.request, handleEmbedSignedUrlBulkGet),
];
