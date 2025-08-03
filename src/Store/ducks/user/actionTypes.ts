export const SignInActionType = 'user/SIGN_IN';

export const TwoFactorStepActionType = 'user/TWO_FACTOR_STEP';

export const SetEmailConfirmedActionType = 'user/SET_EMAIL_CONFIRMED';

export const InitAccessTokenType = 'user/INIT_ACCESS_TOKEN';

export const InitAccessTokenFinishType = 'user/INIT_ACCESS_TOKEN_FINISH';

export enum PrimarySignInActionTypes {
  request = 'user/SIGN_IN_PRIMARY/REQUEST',
  success = 'user/SIGN_IN_PRIMARY/SUCCESS',
  failure = 'user/SIGN_IN_PRIMARY/FAILURE',
  cancel = 'user/SIGN_IN_PRIMARY/CANCEL',
}

export enum TwillioSignInActionTypes {
  request = 'user/SIGN_IN_TWILLIO/REQUEST',
  success = 'user/SIGN_IN_TWILLIO/SUCCESS',
  failure = 'user/SIGN_IN_TWILLIO/FAILURE',
  cancel = 'user/SIGN_IN_TWILLIO/CANCEL',
}

export enum GoogleAuthenticatorSignInActionTypes {
  request = 'user/SIGN_IN_GOOGLE_AUTHENTICATOR/REQUEST',
  success = 'user/SIGN_IN_GOOGLE_AUTHENTICATOR/SUCCESS',
  failure = 'user/SIGN_IN_GOOGLE_AUTHENTICATOR/FAILURE',
  cancel = 'user/SIGN_IN_GOOGLE_AUTHENTICATOR/CANCEL',
}

export enum VerifyGoogleCodeActionTypes {
  request = 'user/VERIFY_GOOGLE_CODE/REQUEST',
  success = 'user/VERIFY_GOOGLE_CODE/SUCCESS',
  failure = 'user/VERIFY_GOOGLE_CODE/FAILURE',
  cancel = 'user/VERIFY_GOOGLE_CODE/CANCEL',
}

export enum DisableGoogleAuthenticatorActionTypes {
  request = 'user/DISABLE_GOOGLE_2FA/REQUEST',
  success = 'user/DISABLE_GOOGLE_2FA/SUCCESS',
  failure = 'user/DISABLE_GOOGLE_2FA/FAILURE',
  cancel = 'user/DISABLE_GOOGLE_2FA/CANCEL',
}

export enum EnableGoogleAuthenticatorActionTypes {
  request = 'user/ENABLE_GOOGLE_2FA/REQUEST',
  success = 'user/ENABLE_GOOGLE_2FA/SUCCESS',
  failure = 'user/ENABLE_GOOGLE_2FA/FAILURE',
  cancel = 'user/ENABLE_GOOGLE_2FA/CANCEL',
}

export enum SignUpActionTypes {
  request = 'user/SIGN_UP/REQUEST',
  success = 'user/SIGN_UP/SUCCESS',
  failure = 'user/SIGN_UP/FAILURE',
  cancel = 'user/SIGN_UP/CANCEL',
}

export enum SignUpTemporaryActionTypes {
  request = 'user/SIGN_UP_TEMPORARY/REQUEST',
  success = 'user/SIGN_UP_TEMPORARY/SUCCESS',
  failure = 'user/SIGN_UP_TEMPORARY/FAILURE',
  cancel = 'user/SIGN_UP_TEMPORARY/CANCEL',
}

export enum SignUpFromTemporaryActionTypes {
  request = 'user/SIGN_UP_FROM_TEMPORARY/REQUEST',
  success = 'user/SIGN_UP_FROM_TEMPORARY/SUCCESS',
  failure = 'user/SIGN_UP_FROM_TEMPORARY/FAILURE',
  cancel = 'user/SIGN_UP_FROM_TEMPORARY/CANCEL',
}

export enum ConfirmTemporaryActionTypes {
  request = 'user/CONFIRM_TEMPORARY/REQUEST',
  success = 'user/CONFIRM_TEMPORARY/SUCCESS',
  failure = 'user/CONFIRM_TEMPORARY/FAILURE',
  cancel = 'user/CONFIRM_TEMPORARY/CANCEL',
}

export enum LtdSignUpActionTypes {
  request = 'user/LTD_SIGN_UP/REQUEST',
  success = 'user/LTD_SIGN_UP/SUCCESS',
  failure = 'user/LTD_SIGN_UP/FAILURE',
  cancel = 'user/LTD_SIGN_UP/CANCEL',
}

export enum SignedGetUrlActionTypes {
  request = 'document/SIGNED_GET_URL/REQUEST',
  success = 'document/SIGNED_GET_URL/SUCCESS',
  failure = 'document/SIGNED_GET_URL/FAILURE',
  cancel = 'document/SIGNED_GET_URL/CANCEL',
}

export enum СompatibleSignedGetUrlActionTypes {
  request = 'document/COMPATIBLE_SIGNED_GET_URL/REQUEST',
  success = 'document/COMPATIBLE_SIGNED_GET_URL/SUCCESS',
  failure = 'document/COMPATIBLE_SIGNED_GET_URL/FAILURE',
  cancel = 'document/COMPATIBLE_SIGNED_GET_URL/CANCEL',
}

export enum SignedGetUrlActionTypesHash {
  request = 'document/SIGNED_GET_URL_HASH/REQUEST',
  success = 'document/SIGNED_GET_URL_HASH/SUCCESS',
  failure = 'document/SIGNED_GET_URL_HASH/FAILURE',
  cancel = 'document/SIGNED_GET_URL_HASH/CANCEL',
}

export enum SignedGetUrlBulkActionTypes {
  request = 'document/SIGNED_GET_URL_BULK/REQUEST',
  success = 'document/SIGNED_GET_URL_BULK/SUCCESS',
  failure = 'document/SIGNED_GET_URL_BULK/FAILURE',
  cancel = 'document/SIGNED_GET_URL_BULK/CANCEL',
}

export enum SignedGetDownloadUrlActionTypes {
  request = 'document/SIGNED_GET_DOWNLOAD_URL/REQUEST',
  success = 'document/SIGNED_GET_DOWNLOAD_URL/SUCCESS',
  failure = 'document/SIGNED_GET_DOWNLOAD_URL/FAILURE',
  cancel = 'document/SIGNED_GET_DOWNLOAD_URL/CANCEL',
}

export enum SignedPutUrlActionTypes {
  request = 'document/SIGNED_PUT_URL/REQUEST',
  success = 'document/SIGNED_PUT_URL/SUCCESS',
  failure = 'document/SIGNED_PUT_URL/FAILURE',
  cancel = 'document/SIGNED_PUT_URL/CANCEL',
}

export enum SignedPutAssetUrlActionTypes {
  request = 'document/SIGNED_PUT_ASSET_URL/REQUEST',
  success = 'document/SIGNED_PUT_ASSET_URL/SUCCESS',
  failure = 'document/SIGNED_PUT_ASSET_URL/FAILURE',
  cancel = 'document/SIGNED_PUT_ASSET_URL/CANCEL',
}

export enum CurrentUserGetActionTypes {
  request = 'user/GET_CURRENT_USER/REQUEST',
  success = 'user/GET_CURRENT_USER/SUCCESS',
  failure = 'user/GET_CURRENT_USER/FAILURE',
  cancel = 'user/GET_CURRENT_USER/CANCEL',
}

export enum RequisitePutActionTypes {
  request = 'user/PUT_REQUISITE/REQUEST',
  success = 'user/PUT_REQUISITE/SUCCESS',
  failure = 'user/PUT_REQUISITE/FAILURE',
  cancel = 'user/PUT_REQUISITE/CANCEL',
}

export enum UpdateProfileInfoActionTypes {
  request = 'user/UPDATE_PROFILE_INFO/REQUEST',
  success = 'user/UPDATE_PROFILE_INFO/SUCCESS',
  failure = 'user/UPDATE_PROFILE_INFO/FAILURE',
  cancel = 'user/UPDATE_PROFILE_INFO/CANCEL',
}

export enum UpdateEmailActionTypes {
  request = 'user/UPDATE_EMAIL/REQUEST',
  success = 'user/UPDATE_EMAIL/SUCCESS',
  failure = 'user/UPDATE_EMAIL/FAILURE',
  cancel = 'user/UPDATE_EMAIL/CANCEL',
}

export enum UpdateCompanyInfoActionTypes {
  request = 'user/UPDATE_COMPANY_INFO/REQUEST',
  success = 'user/UPDATE_COMPANY_INFO/SUCCESS',
  failure = 'user/UPDATE_COMPANY_INFO/FAILURE',
  cancel = 'user/UPDATE_COMPANY_INFO/CANCEL',
}

export enum GenerateCodeActionTypes {
  request = 'user/GENERATE_CODE/REQUEST',
  success = 'user/GENERATE_CODE/SUCCESS',
  failure = 'user/GENERATE_CODE/FAILURE',
  cancel = 'user/GENERATE_CODE/CANCEL',
}

export enum VerifyPhoneActionTypes {
  request = 'user/VERIFY_PHONE/REQUEST',
  success = 'user/VERIFY_PHONE/SUCCESS',
  failure = 'user/VERIFY_PHONE/FAILURE',
  cancel = 'user/VERIFY_PHONE/CANCEL',
}

export enum DisableTwoFactorActionTypes {
  request = 'user/DISABLE_TWO_FACTOR/REQUEST',
  success = 'user/DISABLE_TWO_FACTOR/SUCCESS',
  failure = 'user/DISABLE_TWO_FACTOR/FAILURE',
  cancel = 'user/DISABLE_TWO_FACTOR/CANCEL',
}

export enum DeleteAccountActionTypes {
  request = 'user/DELETE_ACCOUNT/REQUEST',
  success = 'user/DELETE_ACCOUNT/SUCCESS',
  failure = 'user/DELETE_ACCOUNT/FAILURE',
  cancel = 'user/DELETE_ACCOUNT/CANCEL',
}

export enum PutCompanyLogoActionTypes {
  request = 'user/PUT_COMPANY_LOGO/REQUEST',
  success = 'user/PUT_COMPANY_LOGO/SUCCESS',
  failure = 'user/PUT_COMPANY_LOGO/FAILURE',
  cancel = 'user/PUT_COMPANY_LOGO/CANCEL',
}

export enum PutAvatarActionTypes {
  request = 'user/PUT_AVATAR/REQUEST',
  success = 'user/PUT_AVATAR/SUCCESS',
  failure = 'user/PUT_AVATAR/FAILURE',
  cancel = 'user/PUT_AVATAR/CANCEL',
}

export enum SendPasswordChangeEmailActionTypes {
  request = 'user/RESET_PASSWORD_LOGO/REQUEST',
  success = 'user/RESET_PASSWORD_LOGO/SUCCESS',
  failure = 'user/RESET_PASSWORD_LOGO/FAILURE',
  cancel = 'user/RESET_PASSWORD_LOGO/CANCEL',
}

export enum ChangePasswordActionTypes {
  request = 'user/CHANGE_PASSWORD/REQUEST',
  success = 'user/CHANGE_PASSWORD/SUCCESS',
  failure = 'user/CHANGE_PASSWORD/FAILURE',
  cancel = 'user/CHANGE_PASSWORD/CANCEL',
}

export enum ConfirmEmailActionTypes {
  request = 'user/EMAIL_CONFIRM/REQUEST',
  success = 'user/EMAIL_CONFIRM/SUCCESS',
  failure = 'user/EMAIL_CONFIRM/FAILURE',
  cancel = 'user/EMAIL_CONFIRM/CANCEL',
}

export enum ConfirmEmailByTwilioActionTypes {
  request = 'user/EMAIL_CONFIRM_BY_TWILIO/REQUEST',
  success = 'user/EMAIL_CONFIRM_BY_TWILIO/SUCCESS',
  failure = 'user/EMAIL_CONFIRM_BY_TWILIO/FAILURE',
  cancel = 'user/EMAIL_CONFIRM_BY_TWILIO/CANCEL',
}

export enum SendEmailConfirmationActionTypes {
  request = 'user/SEND_EMAIL_CONFIRMATION/REQUEST',
  success = 'user/SEND_EMAIL_CONFIRMATION/SUCCESS',
  failure = 'user/SEND_EMAIL_CONFIRMATION/FAILURE',
  cancel = 'user/SEND_EMAIL_CONFIRMATION/CANCEL',
}

export enum SubscribeOnAPIUpdatesActionTypes {
  request = 'user/SUBSCRIBE_ON_API_UPDATES/REQUEST',
  success = 'user/SUBSCRIBE_ON_API_UPDATES/SUCCESS',
  failure = 'user/SUBSCRIBE_ON_API_UPDATES/FAILURE',
  cancel = 'user/SUBSCRIBE_ON_API_UPDATES/CANCEL',
}

export enum UnsubscribeFromAPIUpdatesActionTypes {
  request = 'user/UNSUBSCRIBE_FROM_API_UPDATES/REQUEST',
  success = 'user/UNSUBSCRIBE_FROM_API_UPDATES/SUCCESS',
  failure = 'user/UNSUBSCRIBE_FROM_API_UPDATES/FAILURE',
  cancel = 'user/UNSUBSCRIBE_FROM_API_UPDATES/CANCEL',
}

export enum SignInAppSumoUserActionTypes {
  request = 'user/SIGN_IN_APPSUMO_USER/REQUEST',
  success = 'user/SIGN_IN_APPSUMO_USER/SUCCESS',
  failure = 'user/SIGN_IN_APPSUMO_USER/FAILURE',
  cancel = 'user/SIGN_IN_APPSUMO_USER/CANCEL',
}

export enum SignersAvatarsGetActionTypes {
  request = 'user/GET_SIGNERS_AVATARS/REQUEST',
  success = 'user/GET_SIGNERS_AVATARS/SUCCESS',
  failure = 'user/GET_SIGNERS_AVATARS/FAILURE',
  cancel = 'user/GET_SIGNERS_AVATARS/CANCEL',
}

export enum SignUpWithPlanPrepareActionTypes {
  request = 'user/SIGN_UP_WITH_PLAN_PREPARE/REQUEST',
  success = 'user/SIGN_UP_WITH_PLAN_PREPARE/SUCCESS',
  failure = 'user/SIGN_UP_WITH_PLAN_PREPARE/FAILURE',
  cancel = 'user/SIGN_UP_WITH_PLAN_PREPARE/CANCEL',
}

export enum SignUpWithConfirmCodeActionTypes {
  request = 'user/SIGN_UP_WITH_CONFIRM_CODE/REQUEST',
  success = 'user/SIGN_UP_WITH_CONFIRM_CODE/SUCCESS',
  failure = 'user/SIGN_UP_WITH_CONFIRM_CODE/FAILURE',
  cancel = 'user/SIGN_UP_WITH_CONFIRM_CODE/CANCEL',
}

export enum UpdateGoogleClientIdActionTypes {
  request = 'user/UPDATE_GOOGLE_CLIENT_ID/REQUEST',
  success = 'user/UPDATE_GOOGLE_CLIENT_ID/SUCCESS',
  failure = 'user/UPDATE_GOOGLE_CLIENT_ID/FAILURE',
  cancel = 'user/UPDATE_GOOGLE_CLIENT_ID/CANCEL',
}

export const LogoutActionType = 'user/LOGOUT';

export enum SignOutActionTypes {
  request = 'user/LOGOUT/REQUEST',
  success = 'user/LOGOUT/SUCCESS',
  failure = 'user/LOGOUT/FAILURE',
  cancel = 'user/LOGOUT/CANCEL',
}

export enum EmbedSignedUrlBulkGetActionTypes {
  request = 'document/GET_EMBED_SIGNED_URL_BULK/REQUEST',
  success = 'document/GET_EMBED_SIGNED_URL_BULK/SUCCESS',
  failure = 'document/GET_EMBED_SIGNED_URL_BULK/FAILURE',
  cancel = 'document/GET_EMBED_SIGNED_URL_BULK/CANCEL',
}

export const setIntegrationActionType = 'user/SET_INTEGRATION';

export const setUnauthorizedActionType = 'user/SET_UNAUTHORIZED';

export const setEmailConfirmationDataType = 'user/SET_EMAIL_CONFIRMATION_DATA';

export const SetPasswordTokenType = 'user/SET_PASSWORD_RESET_TOKEN/SET';

export const ClearPasswordTokenType = 'user/SET_PASSWORD_RESET_TOKEN/CLEAR';

export const ApplyAppSumoLinkType = 'user/APPSUMO_LINK_APPLY/CLEAR';

export const SetEmailTokenType = 'user/SET_EMAIL_RESET_TOKEN/SET';

export const ClearEmailTokenType = 'user/SET_EMAIL_RESET_TOKEN/CLEAR';

export const SocketConnectActionType = 'user/CONNECT_SOCKET';

export const SocketDisconnectActionType = 'user/DISCONNECT_SOCKET';

export const SocketJoinRoom = 'user/JOIN_SOCKET_ROOM';

export const ClearIntegrationDataType = 'user/CLEAR_INTEGRATION_DATA';

export const ClearShowTrialSuccessPageType = 'user/SHOW_TRIAL_SUCCESS_MODAL/CLEAR';
