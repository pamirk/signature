import { CardFormValues } from './Billing';
import { User } from './User';

export interface RecaptchaPayload {
  recaptcha: string;
}

export interface AuthData {
  email: string;
  password?: string;
  id_token?: string;
}

export interface EmailPayload {
  email: string;
}

export interface ResetPasswordPayload extends EmailPayload, RecaptchaPayload {}

export interface PasswordChangeData {
  password: string;
  passwordConfirmation: string;
}

export interface TwillioAuthData {
  code: number;
}

export interface AppSumoPayload {
  token: string;
}

export interface GoogleAuthenticatorData {
  code: string;
}

export interface SignUpData extends AuthData {
  name: string;
  free?: boolean;
}

export interface SignUpWithConfrimCode {
  confirmCode: string;
  userId: string;
}

export type SignUpWithConfirmCodeTemporary = Omit<SignUpWithConfrimCode, 'userId'>;

export interface AuthActionPayload {
  values: AuthData;
}

export interface SignUpActionPayload {
  values: SignUpData;
}

export interface UserResponseData {
  accessToken: string;
  user: User;
  isNewUser?: boolean;
}

export interface TemporaryUserResponseData {
  accessToken: string;
  user: User;
}

export interface TwoFactorResponseData {
  twoFactorToken: string;
  twoFactorType: TwoFactorTypes;
}

export interface CodeConfirmationData extends User {
  codeSend: boolean;
}

export type AuthResponseData = { isSubscriptionRecover?: boolean; user?: User } & (
  | UserResponseData
  | TwoFactorResponseData
  | EmailConfirmationData
);

export interface EmailConfirmationData {
  email: string;
  isEmailConfirmed: boolean;
  userId: string;
}

export type SignUpWithPlanResponseData = CodeConfirmationData;

export enum AuthStatuses {
  AUTHORIZED = 'authorized',
  UNAUTHORIZED = 'unauthorized',
  TRIAL = 'trial',
}

export enum TwoFactorTypes {
  GOOGLE = 'google',
  TWILLIO = 'twillio',
}

export interface UpdateGoogleClientId {
  clientId: string;
}

export interface UserAccessResponseData {
  authStatus: AuthStatuses;
}

export interface TwillioEmailConfirmData extends TwillioAuthData {
  email: string;
}

export interface LandingSignUpData extends SignUpData, CardFormValues {}

export enum DownloadOption {
  NOW = 'now',
  LATER = 'later',
}
