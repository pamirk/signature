import { User, Company, UserAvatar } from 'Interfaces/User';
import {
  AppSumoPayload,
  EmailConfirmationData,
  EmailPayload,
  PasswordChangeData,
  SignUpData,
  SignUpWithConfirmCodeTemporary,
  SignUpWithConfrimCode,
  SignUpWithPlanResponseData,
  TemporaryUserResponseData,
  TwillioEmailConfirmData,
  UpdateGoogleClientId,
  UserResponseData,
} from 'Interfaces/Auth';
import { createAsyncAction, createAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from 'Interfaces/ActionCreators';
import { promisifyAsyncAction } from 'Utils/functions';
import {
  SignUpActionTypes,
  LogoutActionType,
  ApplyAppSumoLinkType,
  SignedGetUrlActionTypes,
  SignedGetUrlActionTypesHash,
  SignedPutUrlActionTypes,
  SocketConnectActionType,
  SocketDisconnectActionType,
  CurrentUserGetActionTypes,
  setUnauthorizedActionType,
  RequisitePutActionTypes,
  UpdateProfileInfoActionTypes,
  DeleteAccountActionTypes,
  PrimarySignInActionTypes,
  SocketJoinRoom,
  SignedGetDownloadUrlActionTypes,
  SendEmailConfirmationActionTypes,
  PutCompanyLogoActionTypes,
  UpdateCompanyInfoActionTypes,
  SignInActionType,
  TwoFactorStepActionType,
  TwillioSignInActionTypes,
  DisableTwoFactorActionTypes,
  VerifyPhoneActionTypes,
  GenerateCodeActionTypes,
  GoogleAuthenticatorSignInActionTypes,
  VerifyGoogleCodeActionTypes,
  DisableGoogleAuthenticatorActionTypes,
  SendPasswordChangeEmailActionTypes,
  EnableGoogleAuthenticatorActionTypes,
  ChangePasswordActionTypes,
  SetPasswordTokenType,
  ClearPasswordTokenType,
  SignedGetUrlBulkActionTypes,
  SubscribeOnAPIUpdatesActionTypes,
  UnsubscribeFromAPIUpdatesActionTypes,
  ClearEmailTokenType,
  SetEmailTokenType,
  ConfirmEmailActionTypes,
  setEmailConfirmationDataType,
  SignInAppSumoUserActionTypes,
  setIntegrationActionType,
  SignedPutAssetUrlActionTypes,
  PutAvatarActionTypes,
  SignersAvatarsGetActionTypes,
  SignUpWithConfirmCodeActionTypes,
  SignUpWithPlanPrepareActionTypes,
  UpdateEmailActionTypes,
  SetEmailConfirmedActionType,
  InitAccessTokenType,
  InitAccessTokenFinishType,
  UpdateGoogleClientIdActionTypes,
  SignOutActionTypes,
  EmbedSignedUrlBulkGetActionTypes,
  ClearIntegrationDataType,
  СompatibleSignedGetUrlActionTypes,
  ConfirmEmailByTwilioActionTypes,
  LtdSignUpActionTypes,
  SignUpTemporaryActionTypes,
  SignUpFromTemporaryActionTypes,
  ConfirmTemporaryActionTypes,
  ClearShowTrialSuccessPageType,
} from './actionTypes';

import {
  AuthActionPayload,
  SignUpActionPayload,
  GoogleAuthenticatorData,
  TwillioAuthData,
  TwoFactorResponseData,
  AuthResponseData,
} from 'Interfaces/Auth';
import { TokenPayload } from 'Interfaces/User';
import {
  SignedUrlPayload,
  SignedUrlHashPayload,
  SignedUrlResponse,
  SocketConnectPayload,
  UploadStatuses,
  BulkSignedUrlPayload,
  BulkSignedUrlResponse,
  NormalizedEntity,
  CompatibleSignedUrlPayload,
} from 'Interfaces/Common';
import { FilePutPayload } from 'Services/AWS';
import {
  PhoneVerifyPayload,
  CodePayload,
  CodeGeneratePayload,
  ProfileInfoPayload,
  PhoneCodePayload,
  UpdateEmailPayload,
} from 'Interfaces/Profile';
import { IntegrationActionPayload } from 'Interfaces/Integration';
import { DocumentIdPayload } from 'Interfaces/Document';

export const signIn = createAction(SignInActionType, (payload: User) => payload)();

export const signOut = createAsyncAction(
  SignOutActionTypes.request,
  SignOutActionTypes.success,
  SignOutActionTypes.failure,
  SignOutActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signOut = promisifyAsyncAction(signOut);

export const setTwoFactor = createAction(
  TwoFactorStepActionType,
  (payload: TwoFactorResponseData) => payload,
)();

export const setIsEmailConfirmed = createAction(
  SetEmailConfirmedActionType,
  (payload: boolean) => payload,
)();

export const initAccessToken = createAction(
  InitAccessTokenType,
  (payload: TokenPayload) => payload,
)();

export const finishInitAccessToken = createAction(InitAccessTokenFinishType)();

export const signInPrimary = createAsyncAction(
  PrimarySignInActionTypes.request,
  PrimarySignInActionTypes.success,
  PrimarySignInActionTypes.failure,
  PrimarySignInActionTypes.cancel,
)<
  [AuthActionPayload, PromisifiedActionMeta],
  [AuthResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signInPrimary = promisifyAsyncAction(signInPrimary);

export const signInTwillio = createAsyncAction(
  TwillioSignInActionTypes.request,
  TwillioSignInActionTypes.success,
  TwillioSignInActionTypes.failure,
  TwillioSignInActionTypes.cancel,
)<
  [TwillioAuthData, PromisifiedActionMeta],
  [AuthResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signInTwillio = promisifyAsyncAction(signInTwillio);

export const signInGoogleAuthenticator = createAsyncAction(
  GoogleAuthenticatorSignInActionTypes.request,
  GoogleAuthenticatorSignInActionTypes.success,
  GoogleAuthenticatorSignInActionTypes.failure,
  GoogleAuthenticatorSignInActionTypes.cancel,
)<
  [GoogleAuthenticatorData, PromisifiedActionMeta],
  [AuthResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signInGoogleAuthenticator = promisifyAsyncAction(signInGoogleAuthenticator);

export const verifyPhone = createAsyncAction(
  VerifyPhoneActionTypes.request,
  VerifyPhoneActionTypes.success,
  VerifyPhoneActionTypes.failure,
  VerifyPhoneActionTypes.cancel,
)<
  [PhoneVerifyPayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $verifyPhone = promisifyAsyncAction(verifyPhone);

export const verifyGoogleCode = createAsyncAction(
  VerifyGoogleCodeActionTypes.request,
  VerifyGoogleCodeActionTypes.success,
  VerifyGoogleCodeActionTypes.failure,
  VerifyGoogleCodeActionTypes.cancel,
)<
  [CodePayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $verifyGoogleCode = promisifyAsyncAction(verifyGoogleCode);

export const disableGoogleAuthenticator = createAsyncAction(
  DisableGoogleAuthenticatorActionTypes.request,
  DisableGoogleAuthenticatorActionTypes.success,
  DisableGoogleAuthenticatorActionTypes.failure,
  DisableGoogleAuthenticatorActionTypes.cancel,
)<
  [CodePayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $disableGoogleAuthenticator = promisifyAsyncAction(
  disableGoogleAuthenticator,
);

export const enableGoogleAuthenticator = createAsyncAction(
  EnableGoogleAuthenticatorActionTypes.request,
  EnableGoogleAuthenticatorActionTypes.success,
  EnableGoogleAuthenticatorActionTypes.failure,
  EnableGoogleAuthenticatorActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [Blob, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $enableGoogleAuthenticator = promisifyAsyncAction(enableGoogleAuthenticator);

export const disableTwillio2fa = createAsyncAction(
  DisableTwoFactorActionTypes.request,
  DisableTwoFactorActionTypes.success,
  DisableTwoFactorActionTypes.failure,
  DisableTwoFactorActionTypes.cancel,
)<
  [PhoneCodePayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $disableTwillio2fa = promisifyAsyncAction(disableTwillio2fa);

export const generateCode = createAsyncAction(
  GenerateCodeActionTypes.request,
  GenerateCodeActionTypes.success,
  GenerateCodeActionTypes.failure,
  GenerateCodeActionTypes.cancel,
)<
  [CodeGeneratePayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $generateCode = promisifyAsyncAction(generateCode);

export const signUp = createAsyncAction(
  SignUpActionTypes.request,
  SignUpActionTypes.success,
  SignUpActionTypes.failure,
  SignUpActionTypes.cancel,
)<
  [SignUpActionPayload, PromisifiedActionMeta],
  [AuthResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signUp = promisifyAsyncAction(signUp);

export const signUpTemporary = createAsyncAction(
  SignUpTemporaryActionTypes.request,
  SignUpTemporaryActionTypes.success,
  SignUpTemporaryActionTypes.failure,
  SignUpTemporaryActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [TemporaryUserResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signUpTemporary = promisifyAsyncAction(signUpTemporary);

export const signUpFromTemporary = createAsyncAction(
  SignUpFromTemporaryActionTypes.request,
  SignUpFromTemporaryActionTypes.success,
  SignUpFromTemporaryActionTypes.failure,
  SignUpFromTemporaryActionTypes.cancel,
)<
  [SignUpData, PromisifiedActionMeta],
  [TemporaryUserResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signUpFromTemporary = promisifyAsyncAction(signUpFromTemporary);

export const confirmTemporary = createAsyncAction(
  ConfirmTemporaryActionTypes.request,
  ConfirmTemporaryActionTypes.success,
  ConfirmTemporaryActionTypes.failure,
  ConfirmTemporaryActionTypes.cancel,
)<
  [SignUpWithConfirmCodeTemporary, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $confirmTemporary = promisifyAsyncAction(confirmTemporary);

export const ltdSignUp = createAsyncAction(
  LtdSignUpActionTypes.request,
  LtdSignUpActionTypes.success,
  LtdSignUpActionTypes.failure,
  LtdSignUpActionTypes.cancel,
)<
  [SignUpActionPayload, PromisifiedActionMeta],
  [AuthResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $ltdSignUp = promisifyAsyncAction(ltdSignUp);

export const getCurrentUser = createAsyncAction(
  CurrentUserGetActionTypes.request,
  CurrentUserGetActionTypes.success,
  CurrentUserGetActionTypes.failure,
  CurrentUserGetActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getCurrentUser = promisifyAsyncAction(getCurrentUser);

export const getSignedGetUrl = createAsyncAction(
  SignedGetUrlActionTypes.request,
  SignedGetUrlActionTypes.success,
  SignedGetUrlActionTypes.failure,
  SignedGetUrlActionTypes.cancel,
)<
  [SignedUrlPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSignedGetUrl = promisifyAsyncAction(getSignedGetUrl);

export const getCompatibleSignedGetUrl = createAsyncAction(
  СompatibleSignedGetUrlActionTypes.request,
  СompatibleSignedGetUrlActionTypes.success,
  СompatibleSignedGetUrlActionTypes.failure,
  СompatibleSignedGetUrlActionTypes.cancel,
)<
  [CompatibleSignedUrlPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getCompatibleSignedGetUrl = promisifyAsyncAction(getCompatibleSignedGetUrl);

export const getSignedGetUrlHash = createAsyncAction(
  SignedGetUrlActionTypesHash.request,
  SignedGetUrlActionTypesHash.success,
  SignedGetUrlActionTypesHash.failure,
  SignedGetUrlActionTypesHash.cancel,
)<
  [SignedUrlHashPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSignedGetUrlHash = promisifyAsyncAction(getSignedGetUrlHash);

export const getSignedGetUrlBulk = createAsyncAction(
  SignedGetUrlBulkActionTypes.request,
  SignedGetUrlBulkActionTypes.success,
  SignedGetUrlBulkActionTypes.failure,
  SignedGetUrlBulkActionTypes.cancel,
)<
  [BulkSignedUrlPayload, PromisifiedActionMeta],
  [BulkSignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSignedGetUrlBulk = promisifyAsyncAction(getSignedGetUrlBulk);

export const getSignedGetDownloadUrl = createAsyncAction(
  SignedGetDownloadUrlActionTypes.request,
  SignedGetDownloadUrlActionTypes.success,
  SignedGetDownloadUrlActionTypes.failure,
  SignedGetDownloadUrlActionTypes.cancel,
)<
  [SignedUrlPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSignedGetDownloadUrl = promisifyAsyncAction(getSignedGetDownloadUrl);

export const getSignedPutUrl = createAsyncAction(
  SignedPutUrlActionTypes.request,
  SignedPutUrlActionTypes.success,
  SignedPutUrlActionTypes.failure,
  SignedPutUrlActionTypes.cancel,
)<
  [SignedUrlPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSignedPutUrl = promisifyAsyncAction(getSignedPutUrl);

export const getSignedPutAssetUrl = createAsyncAction(
  SignedPutAssetUrlActionTypes.request,
  SignedPutAssetUrlActionTypes.success,
  SignedPutAssetUrlActionTypes.failure,
  SignedPutAssetUrlActionTypes.cancel,
)<
  [SignedUrlPayload, PromisifiedActionMeta],
  [SignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSignedPutAssetUrl = promisifyAsyncAction(getSignedPutAssetUrl);

export const putRequisite = createAsyncAction(
  RequisitePutActionTypes.request,
  RequisitePutActionTypes.success,
  RequisitePutActionTypes.failure,
  RequisitePutActionTypes.cancel,
)<
  [FilePutPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const updateProfileInfo = createAsyncAction(
  UpdateProfileInfoActionTypes.request,
  UpdateProfileInfoActionTypes.success,
  UpdateProfileInfoActionTypes.failure,
  UpdateProfileInfoActionTypes.cancel,
)<
  [ProfileInfoPayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateProfileInfo = promisifyAsyncAction(updateProfileInfo);

export const updateEmail = createAsyncAction(
  UpdateEmailActionTypes.request,
  UpdateEmailActionTypes.success,
  UpdateEmailActionTypes.failure,
  UpdateEmailActionTypes.cancel,
)<
  [UpdateEmailPayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateEmail = promisifyAsyncAction(updateEmail);

export const updateCompanyInfo = createAsyncAction(
  UpdateCompanyInfoActionTypes.request,
  UpdateCompanyInfoActionTypes.success,
  UpdateCompanyInfoActionTypes.failure,
  UpdateCompanyInfoActionTypes.cancel,
)<
  [Company, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateCompanyInfo = promisifyAsyncAction(updateCompanyInfo);

export const putCompanyLogo = createAsyncAction(
  PutCompanyLogoActionTypes.request,
  PutCompanyLogoActionTypes.success,
  PutCompanyLogoActionTypes.failure,
  PutCompanyLogoActionTypes.cancel,
)<
  [FilePutPayload, PromisifiedActionMeta],
  [UploadStatuses, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $putCompanyLogo = promisifyAsyncAction(putCompanyLogo);

export const putAvatar = createAsyncAction(
  PutAvatarActionTypes.request,
  PutAvatarActionTypes.success,
  PutAvatarActionTypes.failure,
  PutAvatarActionTypes.cancel,
)<
  [FilePutPayload, PromisifiedActionMeta],
  [UploadStatuses, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $putAvatar = promisifyAsyncAction(putAvatar);

export const deleteAccount = createAsyncAction(
  DeleteAccountActionTypes.request,
  DeleteAccountActionTypes.success,
  DeleteAccountActionTypes.failure,
  DeleteAccountActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteAccount = promisifyAsyncAction(deleteAccount);

export const sendPasswordChangeEmail = createAsyncAction(
  SendPasswordChangeEmailActionTypes.request,
  SendPasswordChangeEmailActionTypes.success,
  SendPasswordChangeEmailActionTypes.failure,
  SendPasswordChangeEmailActionTypes.cancel,
)<
  [EmailPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $sendPasswordChangeEmail = promisifyAsyncAction(sendPasswordChangeEmail);

export const confirmEmail = createAsyncAction(
  ConfirmEmailActionTypes.request,
  ConfirmEmailActionTypes.success,
  ConfirmEmailActionTypes.failure,
  ConfirmEmailActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [AuthResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $confirmEmail = promisifyAsyncAction(confirmEmail);

export const confirmEmailByTwilio = createAsyncAction(
  ConfirmEmailByTwilioActionTypes.request,
  ConfirmEmailByTwilioActionTypes.success,
  ConfirmEmailByTwilioActionTypes.failure,
  ConfirmEmailByTwilioActionTypes.cancel,
)<
  [TwillioEmailConfirmData, PromisifiedActionMeta],
  [AuthResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $confirmEmailByTwilio = promisifyAsyncAction(confirmEmailByTwilio);

export const sendConformationEmail = createAsyncAction(
  SendEmailConfirmationActionTypes.request,
  SendEmailConfirmationActionTypes.success,
  SendEmailConfirmationActionTypes.failure,
  SendEmailConfirmationActionTypes.cancel,
)<
  [EmailPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $sendConformationEmail = promisifyAsyncAction(sendConformationEmail);

export const changePassword = createAsyncAction(
  ChangePasswordActionTypes.request,
  ChangePasswordActionTypes.success,
  ChangePasswordActionTypes.failure,
  ChangePasswordActionTypes.cancel,
)<
  [PasswordChangeData, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $changePassword = promisifyAsyncAction(changePassword);

export const subscribeOnAPIUpdates = createAsyncAction(
  SubscribeOnAPIUpdatesActionTypes.request,
  SubscribeOnAPIUpdatesActionTypes.success,
  SubscribeOnAPIUpdatesActionTypes.failure,
  SubscribeOnAPIUpdatesActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $subscribeOnAPIUpdates = promisifyAsyncAction(subscribeOnAPIUpdates);

export const unsubscribeFromAPIUpdates = createAsyncAction(
  UnsubscribeFromAPIUpdatesActionTypes.request,
  UnsubscribeFromAPIUpdatesActionTypes.success,
  UnsubscribeFromAPIUpdatesActionTypes.failure,
  UnsubscribeFromAPIUpdatesActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const signInAppSumoUser = createAsyncAction(
  SignInAppSumoUserActionTypes.request,
  SignInAppSumoUserActionTypes.success,
  SignInAppSumoUserActionTypes.failure,
  SignInAppSumoUserActionTypes.cancel,
)<
  [AppSumoPayload, PromisifiedActionMeta],
  [AuthResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signInAppSumoUser = promisifyAsyncAction(signInAppSumoUser);

export const getSignersAvatars = createAsyncAction(
  SignersAvatarsGetActionTypes.request,
  SignersAvatarsGetActionTypes.success,
  SignersAvatarsGetActionTypes.failure,
  SignersAvatarsGetActionTypes.cancel,
)<
  [DocumentIdPayload, PromisifiedActionMeta],
  [NormalizedEntity<UserAvatar>, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSignersAvatars = promisifyAsyncAction(getSignersAvatars);

export const signUpWithPlanPrepare = createAsyncAction(
  SignUpWithPlanPrepareActionTypes.request,
  SignUpWithPlanPrepareActionTypes.success,
  SignUpWithPlanPrepareActionTypes.failure,
  SignUpWithPlanPrepareActionTypes.cancel,
)<
  [SignUpActionPayload, PromisifiedActionMeta],
  [SignUpWithPlanResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signUpWithPlanPrepare = promisifyAsyncAction(signUpWithPlanPrepare);

export const signUpWithConfirmCode = createAsyncAction(
  SignUpWithConfirmCodeActionTypes.request,
  SignUpWithConfirmCodeActionTypes.success,
  SignUpWithConfirmCodeActionTypes.failure,
  SignUpWithConfirmCodeActionTypes.cancel,
)<
  [SignUpWithConfrimCode, PromisifiedActionMeta],
  [UserResponseData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $signUpWithConfirmCode = promisifyAsyncAction(signUpWithConfirmCode);

export const updateGoogleClientId = createAsyncAction(
  UpdateGoogleClientIdActionTypes.request,
  UpdateGoogleClientIdActionTypes.success,
  UpdateGoogleClientIdActionTypes.failure,
  UpdateGoogleClientIdActionTypes.cancel,
)<
  [UpdateGoogleClientId, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const getEmbedSignedUrlBulk = createAsyncAction(
  EmbedSignedUrlBulkGetActionTypes.request,
  EmbedSignedUrlBulkGetActionTypes.success,
  EmbedSignedUrlBulkGetActionTypes.failure,
  EmbedSignedUrlBulkGetActionTypes.cancel,
)<
  [BulkSignedUrlPayload, PromisifiedActionMeta],
  [BulkSignedUrlResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getEmbedSignedUrlBulk = promisifyAsyncAction(getEmbedSignedUrlBulk);

export const $updateGoogleClientId = promisifyAsyncAction(updateGoogleClientId);

export const $unsubscribeFromAPIUpdates = promisifyAsyncAction(unsubscribeFromAPIUpdates);

export const $putRequisite = promisifyAsyncAction(putRequisite);

export const setIntegration = createAction(
  setIntegrationActionType,
  (payload: IntegrationActionPayload) => payload,
)();

export const setUnauthorized = createAction(setUnauthorizedActionType)();

export const logout = createAction(LogoutActionType)();

export const setEmailConfirmationData = createAction(
  setEmailConfirmationDataType,
  (payload: EmailConfirmationData) => payload,
)();

export const clearIntegrationData = createAction(
  ClearIntegrationDataType,
  (payload: IntegrationActionPayload) => payload,
)();

export const connectSocket = createAction(
  SocketConnectActionType,
  (payload: SocketConnectPayload) => payload,
)();

export const disconnectSocket = createAction(SocketDisconnectActionType)();

export const setPasswordToken = createAction(
  SetPasswordTokenType,
  (payload: TokenPayload) => payload,
)();

export const clearPasswordToken = createAction(ClearPasswordTokenType)();

export const setEmailToken = createAction(
  SetEmailTokenType,
  (payload: TokenPayload) => payload,
)();

export const clearEmailToken = createAction(ClearEmailTokenType)();

export const joinSocketRoom = createAction(SocketJoinRoom)();

export const applyAppSumoLink = createAction(ApplyAppSumoLinkType)();

export const clearShowTrialSuccessPage = createAction(ClearShowTrialSuccessPageType)();
