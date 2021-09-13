import { UserNotifications, DateFormats } from './User';

export enum DeletionSteps {
  START_DELETION,
  DOWNGRADE_TO_FREE,
  FINAL_DELETION,
}

export enum CodeScopeType {
  VERIFY = 'verify',
  DISABLE = 'disable',
}

export interface ProfileInfo extends UserNotifications {
  name: string;
  timezone: string;
  avatarUrl: string | null;
  billingDetails: string | null;
  password: string;
  passwordConfirmation: string;
  dateFormat: DateFormats;
  phone: {
    code: string;
    number: string;
  };
}

export type ProfileInfoPayload = Partial<ProfileInfo>;

export type UpdateEmailPayload = {
  email: string;
};

export interface PhonePayload {
  phone: string;
}

export interface PhoneCodePayload {
  code: number;
}

export interface CodePayload {
  code: string;
}

export type PhoneVerifyPayload = PhonePayload & PhoneCodePayload;

export interface CodeGeneratePayload extends PhonePayload {
  scope: CodeScopeType;
}
