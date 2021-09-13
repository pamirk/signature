import { User } from './User';

export interface AuthData {
  email: string;
  password?: string;
  id_token?: string;
}

export interface EmailPayload {
  email: string;
}

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
}

export interface SignUpWithConfrimCode {
  confirmCode: string;
  userId: string;
}

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

export interface TwoFactorResponseData {
  twoFactorToken: string;
  twoFactorType: TwoFactorTypes;
}

export interface CodeConfirmationData extends User {
  codeSend: boolean;
}

export type AuthResponseData =
  | UserResponseData
  | TwoFactorResponseData
  | EmailConfirmationData;

export interface EmailConfirmationData {
  email: string;
  isEmailConfirmed: boolean;
}

export type SignUpWithPlanResponseData = CodeConfirmationData;

export enum AuthStatuses {
  AUTHOREZED = 'authorized',
  UNATHORIZED = 'unauthorized',
}

export enum TwoFactorTypes {
  GOOGLE = 'google',
  TWILLIO = 'twillio',
}
