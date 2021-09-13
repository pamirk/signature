import { User, Company, UserAvatar } from 'Interfaces/User';
import Api from './Api';
import {
  PhoneVerifyPayload,
  CodePayload,
  PhoneCodePayload,
  CodeGeneratePayload,
  ProfileInfoPayload,
} from 'Interfaces/Profile';
import { AxiosRequestConfig } from 'axios';
import { DocumentIdPayload } from 'Interfaces/Document';

class UserApi extends Api {
  getUser = () => this.request.get()<User>('user');

  updateProfileInfo = async (values: ProfileInfoPayload) =>
    this.request.patch()<User>(`user/profile`, values);

  updateCompanyInfo = async (values: Company) =>
    this.request.patch()<User>(`user/company`, values);

  verifyPhone = async (payload: PhoneVerifyPayload) =>
    this.request.post()(`user/verify_phone`, payload);

  disableTwillio2fa = async (payload: PhoneCodePayload) =>
    this.request.post()(`user/disable_twillio`, payload);

  generateCode = async (payload: CodeGeneratePayload) => {
    const { phone, scope } = payload;
    const params: AxiosRequestConfig['params'] = { scope };

    return this.request.post()(`user/generate_twillio_code`, { phone }, { params });
  };

  verifyGoogleCode = async (payload: CodePayload) =>
    this.request.post()(`user/verify_google_code`, payload);

  disableGoogleAuthenticator = async (payload: CodePayload) =>
    this.request.post()(`user/disable_google_authenticator`, payload);

  enableGoogleAuthenticator = async () => {
    return this.request.post()<Blob>(`user/enable_google_authenticator`, undefined, {
      responseType: 'blob',
    });
  };

  deleteAccount = async () => this.request.delete()<User>(`user`);

  subscribeToAPIUpdates = () => {
    return this.request.post()<User>('user/api_updates/subscribe');
  };

  unsubscribeFromAPIUpdates = () => {
    return this.request.post()<User>('user/api_updates/unsubscribe');
  };

  getSignersAvatars = (payload: DocumentIdPayload) => {
    return this.request.get()<UserAvatar[]>(`user/signers_avatars/${payload.documentId}`);
  };
}

export default new UserApi();
