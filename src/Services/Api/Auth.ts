import Api from './Api';
import {
  AuthData,
  AuthResponseData,
  UserResponseData,
  TwillioAuthData,
  PasswordChangeData,
  EmailConfirmationData,
  SignUpWithConfrimCode,
} from 'Interfaces/Auth';
import {
  SignedUrlPayload,
  SignedUrlResponse,
  BulkSignedUrlPayload,
  BulkSignedUrlResponse,
} from 'Interfaces/Common';
import { TokenizedPayload, User } from 'Interfaces/User';
import { CodePayload, UpdateEmailPayload } from 'Interfaces/Profile';
import { EmailPayload } from 'Interfaces/Auth';

class AuthApi extends Api {
  signIn = (payload: AuthData) =>
    this.request.post()<AuthResponseData>('auth/sign_in', payload);

  signInTwillio = ({ token, payload }: TokenizedPayload<TwillioAuthData>) =>
    this.request.post(token)<AuthResponseData>('auth/sign_in/twillio', payload);

  signInGoogleAuthenticator = ({ token, payload }: TokenizedPayload<CodePayload>) =>
    this.request.post(token)<UserResponseData>(
      'auth/sign_in/google_authenticator',
      payload,
    );

  googleSignIn = (payload: AuthData) =>
    this.request.post()<UserResponseData>('auth/google_sign_in', payload);

  signUp = (payload: AuthData) =>
    this.request.post()<UserResponseData>('auth/sign_up', payload);

  signUpWithPlanPrepare = (payload: AuthData) =>
    this.request.post()<UserResponseData>('auth/sign_up/prepare', payload);

  signUpWithConfirmCode = (payload: SignUpWithConfrimCode) =>
    this.request.post()<UserResponseData>('auth/sign_up/with_code', payload);

  confirmEmail = (token?: string) =>
    this.request.post(token)<UserResponseData>('auth/confirm_email/confirm');

  sendConformationEmail = (payload: EmailPayload) =>
    this.request.post()('auth/confirm_email/send', payload);

  sendPasswordChangeEmail = async (payload: EmailPayload) =>
    this.request.post()(`auth/change_password/send_mail`, payload);

  changePassword = async ({ token, payload }: TokenizedPayload<PasswordChangeData>) =>
    this.request.post(token)(`auth/change_password/change`, payload);

  getSignedGetUrl = ({ token, payload }: TokenizedPayload<SignedUrlPayload>) => {
    return this.request.post(token)<SignedUrlResponse>('auth/get_signed_url', payload);
  };

  getSignedGetUrlBulk = ({ token, payload }: TokenizedPayload<BulkSignedUrlPayload>) => {
    return this.request.post(token)<BulkSignedUrlResponse>(
      'auth/get_signed_url/bulk',
      payload,
    );
  };

  getSignedPutUrl = ({ token, payload }: TokenizedPayload<SignedUrlPayload>) =>
    this.request.post(token)<SignedUrlResponse>('auth/put_signed_url', payload);

  getSignedPutAssetUrl = (payload: SignedUrlPayload) =>
    this.request.post()<SignedUrlResponse>('auth/put_signed_asset_url', payload);

  getSignedDownloadUrl = ({ token, payload }: TokenizedPayload<SignedUrlPayload>) => {
    return this.request.post(token)<SignedUrlResponse>(
      'auth/get_signed_download_url',
      payload,
    );
  };

  appSumoSignIn = (token: string) => {
    return this.request.post(token)<SignedUrlResponse>('auth/sign_in/appsumo');
  };

  updateEmail = (payload: UpdateEmailPayload) => {
    return this.request.post()<User>('auth/email/change', payload);
  };
}

export default new AuthApi();
