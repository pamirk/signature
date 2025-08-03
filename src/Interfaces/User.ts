import { AuthStatuses } from './Auth';
import { ApiSubscription, AppSumoStatus, LtdTier, PlanDetails } from './Billing';
import { Integration } from './Integration';

export interface SignatureTypesPreferences {
  isDrawnSignaturesAvailable?: boolean;
  isTypedSignaturesAvailable?: boolean;
  isUploadedSignaturesAvailable?: boolean;
}

export interface SignerAccessCodesPreferences {
  enableDocumentCodeAccess: boolean;
  enableTemplateCodeAccess: boolean;
  enableFormRequestCodeAccess: boolean;
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
  signerAccessCodesPreferences?: SignerAccessCodesPreferences;
  enableDownloadOriginalDocumentForSigners?: boolean;
  enableIndependentRequests?: boolean;
  enableIndependentActivity?: boolean;
}

export type AvatarUrl = string | null;

export interface Avatar {
  avatarUrl: AvatarUrl;
}

export interface UserNotifications {
  isReceivingReminders: boolean;
  isSendingToAllPartiesInOrderedDocument: boolean;
  isSubscribedOnProcessingToAwaitingConvert: boolean;
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
  taxId: string | null;
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
  personalDocumentsUsed: number;
  appSumoStatus: AppSumoStatus;
  freeDocumentsUsedLimit: number;
  personalDocumentsUsedLimit: number;
  isSubscribedOnAPIUpdates: boolean;
  isEmailConfirmed: boolean;
  isAuthorized: boolean;
  authStatus?: AuthStatuses;
  paymentSurveyAnswer: string;
  status: UserStatuses;
  customerId: string;
  clientId?: string;
  signatureRequestsSent: number;
  isTrialUsed: boolean;
  isTrialSubscription: boolean;
  showTrialStep: boolean;
  ltdTierId: LtdTier['id'];
  isTemporary: boolean;
  workflowVersion?: WorkflowVersions;
}

export enum UserStatuses {
  ACTIVE = 'active',
  FREEZE = 'freeze',
}

export type UserAvatar = Pick<User, 'id' | 'avatarUrl'>;

export enum DateFormats {
  MM_DD_YYYY = 'MM/DD/YYYY',
  DD_MM_YYYY = 'DD/MM/YYYY',
  YYYY_MM_DD = 'YYYY/MM/DD',
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
  userId?: User['id'];
}

export enum WorkflowVersions {
  A = 'a',
  B = 'b',
}

export const TeammateRoles = [
  { value: UserRoles.ADMIN, label: 'Admin' },
  { value: UserRoles.USER, label: 'User' },
];
