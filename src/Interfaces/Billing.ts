import { NormalizedEntity, EntityDates } from './Common';

export interface CardFormValues {
  number: string;
  expirationDate: string;
  cvv: string;
  cardholderName: string;
  postalCode: string;
}

export interface CardPayload {
  values: CardFormValues;
}

export interface Card {
  cardType: string;
  cardholderName: string;
  customerLocation: string;
  expirationDate: string;
  last4: string;
  maskedNumber: string;
}

export interface Invoice {
  id: string;
  createdAt: string;
  pdfKey: string;
  amount: string;
}

export enum PlanTypes {
  FREE = 'free',
  PERSONAL = 'personal',
  BUSINESS = 'business',
}

export enum PlanDurations {
  MONTHLY = 'monthly',
  ANNUALLY = 'annually',
}

export const PlanDurationAcronims = {
  [PlanDurations.MONTHLY]: 'mo',
  [PlanDurations.ANNUALLY]: 'year',
};

export type ApiPlanItem = {
  header: string;
  title: string;
  price: string;
  type: ApiPlanTypes;
  duration: PlanDurations;
  content: string[];
};

export enum ApiPlanTypes {
  FREE = 'free',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  TITANIUM = 'titanium',
  APPSUMO_STANDARD = 'appsumo_standard',
  APPSUMO_FULL = 'appsumo_full',
}
export interface Plan {
  type: PlanTypes;
  duration: PlanDurations;
  title: string;
}

export interface ApiPlan {
  type: ApiPlanTypes;
  duration: PlanDurations;
  title: string;
}

export interface ApiPlanInfo extends ApiPlan {
  requestLimit: number;
  templateLimit: number;
  name: string;
}

export enum AppSumoStatus {
  STANDARD = 'standard',
  FULL = 'full',
}

export interface PlanDetails extends EntityDates {
  id: string;
  name: string;
  description: string;
  price: string;
  type: PlanTypes;
  duration: PlanDurations;
}

export interface ApiSubscription {
  requestsMonthlyUsed: number;
  testRequestsMonthlyUsed: number;
  templatesCount: number;
  apiPlan: PlanDetails;
}

export interface AddOn {
  id: string;
  amount: string;
  quantity: number;
  name: string;
  currentBillingCycle: number;
}

export interface SubscriptionData {
  addOns: AddOn[];
  planId: string;
}

export interface SubscriptionInfo {
  userQuantity: number;
  amount: number;
  discountQuantity: number;
  discountAmount: number;
  nextBillingDate: string;
  price?: number;
}

export interface ApiSubscriptionInfo {
  nextBillingDate: string;
  price?: number;
}

export interface BillingData {
  plans: PlanDetails[];
  subscriptionData: SubscriptionData;
  apiSubscription: ApiSubscription | null;
  apiPlans: PlanDetails[];
  card: Card;
  invoiceItems: NormalizedEntity<Invoice>;
}

export interface BillingDetailsUpdatePayload {
  billingDetails: string | null;
}

export interface DownloadInvoicePayload {
  invoiceId: string;
}

export interface PlanChangePayload {
  type: PlanTypes;
  duration: PlanDurations;
  paymentSurveyAnswer?: string;
}

export interface ApiPlanChangePayload {
  type: ApiPlanTypes;
  duration: PlanDurations;
}

export interface AppSumoUpgradePayload {
  code: string;
}

export const planTerms = {
  [PlanTypes.PERSONAL]: {
    [PlanDurations.MONTHLY]: {
      title: 'PersonalMonthly',
      cost: 10,
    },
    [PlanDurations.ANNUALLY]: {
      title: 'PersonalAnnual',
      cost: 96,
    },
  },
  [PlanTypes.BUSINESS]: {
    [PlanDurations.MONTHLY]: {
      title: 'BusinessMonthly',
      cost: 15,
    },
    [PlanDurations.ANNUALLY]: {
      title: 'BusinessAnnual',
      cost: 144,
    },
  },
};

export const dataLayerPlanNames = {
  [PlanTypes.PERSONAL]: {
    [PlanDurations.MONTHLY]: {
      title: 'Paid Personal Plan Monthly',
      cost: 10,
    },
    [PlanDurations.ANNUALLY]: {
      title: 'Paid Personal Plan Annually',
      cost: 96,
    },
  },
  [PlanTypes.BUSINESS]: {
    [PlanDurations.MONTHLY]: {
      title: 'Paid Business Plan Monthly',
      cost: 15,
    },
    [PlanDurations.ANNUALLY]: {
      title: 'Paid Business Plan Annually',
      cost: 144,
    },
  },
};

export enum InvoiceTypes {
  API = 'api',
  DEFAULT = 'default',
}
