import { RootState } from 'typesafe-actions';
import { values, orderBy, isEmpty } from 'lodash';
import { createSelector } from 'reselect';
import { UserReducerState } from 'Store/ducks/user/reducer';
import {
  Document,
  Signer,
  DocumentTypes,
  DocumentStatuses,
  DocumentWithCompany,
} from 'Interfaces/Document';
import { User, Company } from 'Interfaces/User';
import { PaginationData, SelectableOption } from 'Interfaces/Common';
import { DocumentField, DocumentFieldsState } from 'Interfaces/DocumentFields';
import { AuthStatuses, TwoFactorTypes } from 'Interfaces/Auth';
import {
  ApiPlanInfo,
  ApiPlanTypes,
  ApiSubscription,
  BillingData,
  CardFormValues,
  Invoice,
  PlanDetails,
  PlanDurations,
  SubscriptionInfo,
} from 'Interfaces/Billing';
import { TeamMember } from 'Interfaces/Team';
import { Requisite, RequisiteType, RequisiteValueType } from 'Interfaces/Requisite';
import { isNotEmpty } from './functions';
import { ProfileInfo } from 'Interfaces/Profile';
import { ApiKey } from 'Interfaces/ApiKey';
import { RequestHistoryItem } from 'Interfaces/RequestsHistory';
import { Contract } from 'Interfaces/Contract';
interface Reselector<ReturnType> {
  (state, props): ReturnType;
}

export const selectState = (state: RootState) => state;

export const selectProps = (state: RootState, props) => props;

export const selectUser = (state: RootState): User => state.user;

export const selectTwoFactorType = (state: RootState): TwoFactorTypes =>
  state.user.twoFactorType;

export const selectUserIntegrations = (state: RootState) => {
  return state.user.integrations;
};

export const selectProfileInfo = (state: RootState) => {
  const {
    name,
    timezone,
    isReceivingReminders,
    isSendingToAllPartiesInOrderedDocument,
    isReceivingSignerSigned,
    dateFormat,
    isReceivingSigned,
    isReceivingOpenedSigning,
    isReceivingCompletedDocument,
    isSendingCompletedDocument,
    isReceivingSignatureRequestsDailyReport,
  } = state.user;

  return {
    name,
    timezone,
    isReceivingReminders,
    isSendingToAllPartiesInOrderedDocument,
    isReceivingSignerSigned,
    dateFormat,
    isReceivingSigned,
    isReceivingOpenedSigning,
    isReceivingCompletedDocument,
    isSendingCompletedDocument,
    isReceivingSignatureRequestsDailyReport,
  } as ProfileInfo;
};

export const selectAvatarInfo = (state: RootState) => {
  const { name, email, avatarUrl } = state.user;

  return { name, email, avatarUrl };
};

export const selectSignToken = (state: RootState): UserReducerState['signToken'] =>
  state.user.signToken;

export const selectEmailToken = (state: RootState): UserReducerState['emailToken'] =>
  state.user.emailToken;

export const selectTwoFactorToken = (
  state: RootState,
): UserReducerState['twoFactorToken'] => state.user.twoFactorToken;

export const selectPasswordToken = (
  state: RootState,
): UserReducerState['passwordToken'] => state.user.passwordToken;

export const selectAuthStatus = (state: RootState): AuthStatuses => state.user.authStatus;

export const selectUserPlan = (state: RootState) => state.user.plan as PlanDetails;

export const selectSubsciptionInfo = (state: RootState): SubscriptionInfo => {
  const { subscriptionData } = state.billing;

  if (isEmpty(subscriptionData)) return {} as SubscriptionInfo;

  const addOn = subscriptionData.addOns ? subscriptionData.addOns[0] : {};
  const discount = subscriptionData.discounts?.length
    ? subscriptionData.discounts[0]
    : {};

  const { amount, quantity: userQuantity } = addOn;
  const { amount: discountAmount, quantity: discountQuantity } = discount;

  return {
    amount,
    discountAmount: discountAmount || 0,
    discountQuantity: discountQuantity || 0,
    userQuantity,
    nextBillingDate: subscriptionData.nextBillingDate,
  };
};

export const selectApiSubscriptionInfo = (
  state: RootState,
): ApiSubscription | undefined => {
  const { apiSubscription } = state.billing;

  if (apiSubscription) {
    const { apiPlan, ...apiSubscriptionInfo } = apiSubscription;
    return apiSubscriptionInfo;
  }
};

export const selectApiPlan = (state: RootState): ApiPlanInfo => {
  const { apiSubscription } = state.billing;

  return apiSubscription
    ? apiSubscription.apiPlan
    : {
        type: ApiPlanTypes.FREE,
        duration: PlanDurations.MONTHLY,
      };
};

export const selectDocuments = (state: RootState): Document[] => {
  const documents = values(state.document) || [];
  return documents.filter(document => document.type !== DocumentTypes.TEMPLATE);
};

export const selectInvoices = (state: RootState): Invoice[] =>
  values(state.billing.invoices) || [];

export const selectRequisites = (state: RootState): Requisite[] =>
  values(state.requisite) || [];

export const selectDocument = createSelector(
  [selectState, selectProps],
  (state: RootState, props: { documentId: Document['id'] }): Document | undefined => {
    const documentId = props.documentId;

    return state.document[documentId];
  },
) as Reselector<Document | undefined>;

export const selectDocumentWithCompany = createSelector(
  [selectState, selectProps],
  (state: RootState, props: { documentId: Document['id'] }): Document | undefined => {
    const documentId = props.documentId;

    return state.document[documentId];
  },
) as Reselector<DocumentWithCompany | undefined>;

export const selectDocumentSigner = createSelector(
  [selectDocument, selectProps],
  (document: Document | undefined, props: { signerId?: Signer['id'] }) => {
    const signerId = props.signerId;

    return document?.signers.find(signer => signer.id === signerId);
  },
);

export const selectDocumentSignerOptions = createSelector(
  [selectDocument, selectUser],
  (document, user: User): SelectableOption<Signer['id']>[] => {
    if (document) {
      return document.signers.map(signer => ({
        value: signer.id,
        label:
          document.type === DocumentTypes.TEMPLATE ||
          document.type === DocumentTypes.FORM_REQUEST
            ? (signer.role as string)
            : `${signer.name}${
                signer.email === user.email && !signer.isPreparer
                  ? ' (Send via email)'
                  : ''
              }`,
      }));
    }

    return [];
  },
) as Reselector<SelectableOption<Signer['id']>[]>;

export const selectDocumentsPaginationData = (state: RootState): PaginationData =>
  state.meta.documents;

export const selectTemplates = (state: RootState): Document[] => {
  const documents = values(state.document) || [];
  return documents.filter(document => document.type === DocumentTypes.TEMPLATE);
};

export const selectActiveTemplates = (state: RootState): Document[] => {
  const documents = values(state.document) || [];
  return documents.filter(
    document =>
      document.type === DocumentTypes.TEMPLATE &&
      document.status === DocumentStatuses.ACTIVE,
  );
};

export const selectFormRequests = (state: RootState): Document[] => {
  const documents = values(state.document) || [];
  return documents.filter(document => document.type === DocumentTypes.FORM_REQUEST);
};

export const selectActiveFormRequests = (state: RootState): Document[] => {
  const documents = values(state.document) || [];
  return documents.filter(
    document =>
      document.type === DocumentTypes.FORM_REQUEST &&
      document.status === DocumentStatuses.ACTIVE,
  );
};

export const selectOneRoleTemplates = createSelector(selectActiveTemplates, templates =>
  templates.filter(template => template.signers.length === 2),
);

export const selectDocumentFieldsMeta = (state: RootState): DocumentFieldsState['meta'] =>
  state.documentField.meta;

//@ts-ignore
export const selectDocumentFields = (state: RootState): DocumentField[] =>
  orderBy(values(state.documentField.fields) || [], 'createdAt', 'asc').map(field => ({
    ...field,
    style: field.style || {},
  }));

export const selectIsCompanyRedirect = (state: RootState): boolean =>
  state.company.isRedirect;

export const selectCompanyData = (state: RootState): Company => {
  const {
    tagline,
    companyEmail,
    emailTemplate,
    companyName,
    companyLogoKey,
    industry,
    redirectionPage,
    signatureTypesPreferences,
    enableSignerAccessCodes,
  } = state.user;

  return {
    tagline,
    companyEmail,
    emailTemplate,
    companyName,
    companyLogoKey,
    industry,
    redirectionPage,
    signatureTypesPreferences,
    enableSignerAccessCodes,
  };
};

export const selectAvailableSignatureTypes = (state: RootState): RequisiteValueType[] => {
  const {
    isDrawnSignaturesAvailable,
    isTypedSignaturesAvailable,
    isUploadedSignaturesAvailable,
  } = state.user.signatureTypesPreferences;

  const availableSignatureTypes = [
    isTypedSignaturesAvailable && RequisiteValueType.TEXT,
    isDrawnSignaturesAvailable && RequisiteValueType.DRAW,
    isUploadedSignaturesAvailable && RequisiteValueType.UPLOAD,
  ].filter(Boolean);

  return availableSignatureTypes;
};

export const selectBillingData = (state: RootState): BillingData => state.billing;

export const selectCardFormValues = (state: RootState): CardFormValues | undefined => {
  const { card } = state.billing;

  if (isNotEmpty(card)) {
    const { expirationDate, cardholderName, last4 } = card;

    return {
      number: `************${last4}`,
      cvv: '****',
      postalCode: '*****',
      expirationDate,
      cardholderName,
    } as CardFormValues;
  }
};

export const selectCardType = (state: RootState) => {
  const { card } = state.billing;

  if (isNotEmpty(card)) {
    return card.cardType;
  }
};

export const selectRequisite = (
  state: RootState,
  props: { requisiteId: Requisite['id'] },
): Requisite | undefined => state.requisite[props.requisiteId];

export const selectSignatures = createSelector(selectRequisites, requisites =>
  requisites.filter(
    requisite => requisite.type === RequisiteType.SIGN && !requisite.deletedAt,
  ),
);

export const selectInitials = createSelector(selectRequisites, requisites =>
  requisites.filter(
    requisite => requisite.type === RequisiteType.INITIAL && !requisite.deletedAt,
  ),
);

export const selectTeamMembers = (state: RootState): TeamMember[] =>
  values(state.team) || [];

export const selectTeamMembersPaginationData = (state: RootState): PaginationData =>
  state.meta.teamMembers;

export const selectFreeDocumentsUsed = (state: RootState): number =>
  state.user.freeDocumentsUsed;

export const selectIsAppSumoLinkUsed = (state: RootState): boolean =>
  state.user.isAppSumoLinkUsed;

export const selectApiKeysPaginationData = (state: RootState): PaginationData =>
  state.meta.apiKeys;

export const selectApiKeys = (state: RootState): ApiKey[] => {
  const apiKeys = values(state.apiKey) || [];
  return apiKeys;
};

export const selectRequestHistoryPaginationData = (state: RootState): PaginationData =>
  state.meta.requestHistory;

export const selectRequestHistory = (state: RootState): RequestHistoryItem[] => {
  const requestHistory = values(state.requestHistory) || [];
  return requestHistory;
};

export const selectFormRequestsContracts = (state: RootState): Contract[] => {
  return values(state.contracts) || [];
};

export const selectApiTemplatesCount = createSelector(
  selectTemplates,
  templates =>
    templates.filter(template => template.status === DocumentStatuses.API).length,
);

export const selectCommonTemplatesCount = createSelector(
  selectTemplates,
  templates =>
    templates.filter(template => template.status !== DocumentStatuses.API).length,
);

export const selectIsEmailConfirmed = (state: RootState) => state.meta.isEmailConfirmed;
