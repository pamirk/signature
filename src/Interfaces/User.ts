import { Integration } from './Integration';
import { ApiSubscription, AppSumoStatus, PlanDetails } from './Billing';
import { AuthStatuses } from './Auth';

export interface SignatureTypesPreferences {
  isDrawnSignaturesAvailable?: boolean;
  isTypedSignaturesAvailable?: boolean;
  isUploadedSignaturesAvailable?: boolean;
}

export interface Company {
  companyLogoKey?: string | null;
  companyName?: string | null;
  companyEmail?: string | null;
  tagline?: string | null;
  redirectionPage?: string | null;
  emailTemplate?: string | null;
  industry?: string | null;
  signatureTypesPreferences?: SignatureTypesPreferences;
  enableSignerAccessCodes?: boolean;
}

export type AvatarUrl = string | null;

export interface Avatar {
  avatarUrl: AvatarUrl;
}

export interface UserNotifications {
  isReceivingReminders: boolean;
  isSendingToAllPartiesInOrderedDocument: boolean;
  isReceivingSignerSigned: boolean;
  isReceivingSigned: boolean;
  isReceivingOpenedSigning: boolean;
  isReceivingCompletedDocument: boolean;
  isSendingCompletedDocument: boolean;
  isReceivingSignatureRequestsDailyReport: boolean;
}

export interface User extends UserNotifications, Company, Avatar {
  id: string;
  name?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  image?: string;
  dateFormat: DateFormats;
  billingDetails: string | null;
  role: UserRoles;
  last4: string;
  isTwillio2fa: boolean;
  isGoogle2fa: boolean;
  phoneNumber: string | null;
  integrations: Integration[];
  plan: PlanDetails;
  apiSubscription: ApiSubscription;
  teamId: string;
  subscriptionId: string;
  freeDocumentsUsed: number;
  appSumoStatus: AppSumoStatus;
  freeDocumentsUsedLimit: number;
  isSubscribedOnAPIUpdates: boolean;
  isEmailConfirmed: boolean;
  authStatus?: AuthStatuses;
  paymentSurveyAnswer: string;
}

export type UserAvatar = Pick<User, 'id' | 'avatarUrl'>;

export enum DateFormats {
  MM_DD_YYYY = 'MM/DD/YYYY',
  DD_MM_YYYY = 'DD/MM/YYYY',
  MM_DD_YY = 'MM/DD/YY',
  DD_MM_YY = 'DD/MM/YY',
}

export enum UserRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}

export interface TokenPayload {
  token: string;
}

export interface TokenizedPayload<T> extends Partial<TokenPayload> {
  payload: T;
}

export interface UserIdPayload {
  userId: User['id'];
}
