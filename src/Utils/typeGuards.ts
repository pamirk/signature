import {
  AuthResponseData,
  UserResponseData,
  TwoFactorResponseData,
  EmailConfirmationData,
  SignUpWithPlanResponseData,
  CodeConfirmationData,
} from 'Interfaces/Auth';
import { DocumentForSigners } from 'Interfaces/Document';

export const isUserResponseData = (data: AuthResponseData): data is UserResponseData => {
  return (data as UserResponseData).accessToken !== undefined;
};

export const isEmailConfirmationData = (
  data: AuthResponseData,
): data is EmailConfirmationData => {
  return (data as EmailConfirmationData).isEmailConfirmed !== undefined;
};

export const isTwoFactorResponseData = (
  data: AuthResponseData,
): data is TwoFactorResponseData => {
  return (data as TwoFactorResponseData).twoFactorToken !== undefined;
};

export const isCodeSend = (
  data: SignUpWithPlanResponseData,
): data is CodeConfirmationData => {
  return (data as CodeConfirmationData).codeSend;
};

export const isDocumentAccessRequired = (
  data: DocumentForSigners,
): data is DocumentForSigners => {
  return (data as DocumentForSigners).isNeedCodeAccess !== undefined;
};
