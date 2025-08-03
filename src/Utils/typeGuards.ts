import {
  AuthResponseData,
  UserResponseData,
  TwoFactorResponseData,
  EmailConfirmationData,
  SignUpWithPlanResponseData,
  CodeConfirmationData,
} from 'Interfaces/Auth';
import {
  DocumentForSigners,
  DocumentForSigning,
  DocumentStatuses,
} from 'Interfaces/Document';
import { isNotEmpty } from './functions';

export const isUserResponseData = (data: AuthResponseData): data is UserResponseData => {
  return (data as UserResponseData).user !== undefined;
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

export const isDocumentWithSingleSigners = (
  data: DocumentForSigning | {},
): data is DocumentForSigning =>
  isNotEmpty(data) && isNotEmpty(data.signers) && data.signers.length === 1;

export const isDocumentWithMultipleSigners = (
  data: DocumentForSigning | {},
): data is DocumentForSigning =>
  isNotEmpty(data) && isNotEmpty(data.signers) && data.signers.length > 1;

export const shouldOpenDocumentSignersModal = (
  data: DocumentForSigning | {},
): data is DocumentForSigning =>
  isDocumentWithMultipleSigners(data) &&
  data.status !== DocumentStatuses.COMPLETED &&
  (data.status !== DocumentStatuses.AWAITING ||
    !data.signers.every(signer => signer.isFinished));
