import { IS_BLACK_FRIDAY, IS_END_OF_YEAR } from 'Utils/constants';
import {
  NormalizedEntity,
  EntityDates,
  PaginationData,
  PaginationParams,
  OrderingParams,
} from './Common';
import { LtdTiersIds } from 'Pages/Settings/Billing/screens/LifeTimeDealScreen/planTableItems';
import { CancellationReason } from './UserFeedbacks';

export interface CardFormValues {
  number: string;
  expirationDate: string;
  cvv: string;
  cardholderName: string;
  postalCode: string;
}

export interface CardPayload {
  token: string;
}

export interface Card {
  number: string;
  expirationDate: string;
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
  FOREVER = 'forever',
}

export enum PlanIds {
  BUSINESS = 'mqfm',
  BUSINNES_ANNUALLY = 'dbz2',
  PERSONAL = 'gpfc',
  PERSONAL_ANNUALLY = 'mb88',
  FREE = 'free',
  PERSONAL_ARCHIVED = 'cfpg',
  PERSONAL_ANNUALLY_ARCHIVED = 'mb66',
}

export enum SpecialOfferKinds {
  PLAN_CANCEL = 'plan_cancel',
}

export const signatureLimitedPlans = [
  PlanIds.FREE,
  PlanIds.PERSONAL,
  PlanIds.PERSONAL_ANNUALLY,
];

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
  LTD_API_PLAN = 'ltd_api_plan',
}

export interface Plan {
  type: PlanTypes;
  duration: PlanDurations;
  title?: string;
  id?: string;
  quantity?: number;
}

export interface ApiPlan {
  type: ApiPlanTypes;
  duration: PlanDurations;
  title: string;
  id?: string;
  requestLimit?: number;
}

export interface UpcomingInvoiceTypes {
  amount: number;
  quantity: number;
  currency: string;
  plan: {
    name: string;
    type: string;
    duration: string;
    price: string;
  };
  discountedAmount: number;
  discount: number;
  total: number;
  nextInvoiceDate: string;
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

export interface CreateSubscriptionCheckoutPayload {
  type: PlanTypes | ApiPlanTypes;
  duration: PlanDurations;
  couponId?: string;
}

export interface CheckoutSessionUrl {
  checkoutUrl: string;
}

export interface ApiSubscription {
  requestsMonthlyUsed: number;
  testRequestsMonthlyUsed: number;
  templatesCount: number;
  apiPlan: PlanDetails;
  nextBillingDate: Date;
  neverExpires: boolean;
  requestLimit: number;
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

export interface ValidatePromotionCodePayload {
  code: string;
  plan: Plan | ApiPlan;
  authorized: boolean;
}

export interface DiscountData {
  id: string;
  name: string;
  percentOff: number;
  isValid: boolean;
}

export interface SubscriptionInfo {
  userQuantity: number;
  amount: number;
  discountQuantity: number;
  discountAmount: number;
  discountPercent: number;
  nextBillingDate: string;
  price?: number;
  neverExpires: boolean;
  trialEnd?: string;
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
  taxId: string | null;
}

export interface DownloadInvoicePayload {
  invoiceId: string;
}

export interface PlanChangePayload {
  type: PlanTypes | ApiPlanTypes;
  duration: PlanDurations;
  paymentSurveyAnswer?: string;
  couponId?: string;
  trial?: boolean;
  specialOfferKind?: SpecialOfferKinds;
}

export interface PlanCancelPayload {
  cancellationReason?: CancellationReason;
  plannedReturnDate?: string;
  comment?: string;
}

export type PlanCancelSubscriptionOption = 'trial' | 'monthly' | 'yearly';

export interface PlanCancelFormValues extends PlanCancelPayload {
  step: 'wizard' | 'confirm';
}

export interface ApiPlanChangePayload {
  type: ApiPlanTypes;
  duration: PlanDurations;
  couponId?: string;
}

export interface AppSumoUpgradePayload {
  code: string;
}

export interface GetLatestInvoicePayload {
  subscriptionId: string;
  transactionId: string;
  amount: number;
  currency: string;
}

export interface GetUpcomingInvoicePayload {
  amount: number;
  total: number;
  discount: number;
  currency: string;
  quantity: number;
  unusedTime: number;
}

export const DefaultAnnuallyDiscount = 20;
export const AnnuallyDiscount = IS_BLACK_FRIDAY
  ? 40
  : IS_END_OF_YEAR
  ? 35
  : DefaultAnnuallyDiscount;
export const MonthlyDiscount = IS_BLACK_FRIDAY ? 20 : IS_END_OF_YEAR ? 15 : 0;
export const DefaultUpsellDiscount = 30;
export const LtdStandardDiscount = 30;

export const discountByDuration = {
  [PlanDurations.MONTHLY]: MonthlyDiscount,
  [PlanDurations.ANNUALLY]: AnnuallyDiscount,
};

// Initial plan prices
const initialPlanPrices = {
  [PlanTypes.BUSINESS]: {
    [PlanDurations.MONTHLY]: 50,
    [PlanDurations.ANNUALLY]: 600,
  },
  [PlanTypes.PERSONAL]: {
    [PlanDurations.MONTHLY]: 25,
    [PlanDurations.ANNUALLY]: 300,
  },
};

export const getTotalPrice = (price: number, discount: number) => {
  return price * (1 - discount / 100);
};

export const defaultPlanPrices = {
  [PlanTypes.BUSINESS]: {
    [PlanDurations.MONTHLY]: initialPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY],
    [PlanDurations.ANNUALLY]:
      getTotalPrice(
        initialPlanPrices[PlanTypes.BUSINESS][PlanDurations.ANNUALLY],
        DefaultAnnuallyDiscount,
      ) / 12,
  },
  [PlanTypes.PERSONAL]: {
    [PlanDurations.MONTHLY]: initialPlanPrices[PlanTypes.PERSONAL][PlanDurations.MONTHLY],
    [PlanDurations.ANNUALLY]:
      getTotalPrice(
        initialPlanPrices[PlanTypes.PERSONAL][PlanDurations.ANNUALLY],
        DefaultAnnuallyDiscount,
      ) / 12,
  },
};

export const discountPlanPrices = {
  [PlanTypes.BUSINESS]: {
    [PlanDurations.MONTHLY]: getTotalPrice(
      initialPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY],
      MonthlyDiscount,
    ),
    [PlanDurations.ANNUALLY]:
      getTotalPrice(
        initialPlanPrices[PlanTypes.BUSINESS][PlanDurations.ANNUALLY],
        AnnuallyDiscount,
      ) / 12,
  },
  [PlanTypes.PERSONAL]: {
    [PlanDurations.MONTHLY]: getTotalPrice(
      initialPlanPrices[PlanTypes.PERSONAL][PlanDurations.MONTHLY],
      MonthlyDiscount,
    ),
    [PlanDurations.ANNUALLY]:
      getTotalPrice(
        initialPlanPrices[PlanTypes.PERSONAL][PlanDurations.ANNUALLY],
        AnnuallyDiscount,
      ) / 12,
  },
};

// constant for Facebook
export const planTerms = {
  [PlanTypes.PERSONAL]: {
    [PlanDurations.MONTHLY]: {
      title: 'PersonalMonthly',
      cost: defaultPlanPrices[PlanTypes.PERSONAL][PlanDurations.MONTHLY],
    },
    [PlanDurations.ANNUALLY]: {
      title: 'PersonalAnnual',
      cost: discountPlanPrices[PlanTypes.PERSONAL][PlanDurations.ANNUALLY],
    },
  },
  [PlanTypes.BUSINESS]: {
    [PlanDurations.MONTHLY]: {
      title: 'BusinessMonthly',
      cost: defaultPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY],
    },
    [PlanDurations.ANNUALLY]: {
      title: 'BusinessAnnual',
      cost: discountPlanPrices[PlanTypes.BUSINESS][PlanDurations.ANNUALLY],
    },
  },
};

// constant for Google Analytics
export const dataLayerPlanNames = {
  [PlanTypes.PERSONAL]: {
    [PlanDurations.MONTHLY]: {
      title: 'Paid Personal Plan Monthly',
      cost: defaultPlanPrices[PlanTypes.PERSONAL][PlanDurations.MONTHLY],
    },
    [PlanDurations.ANNUALLY]: {
      title: 'Paid Personal Plan Annually',
      cost: defaultPlanPrices[PlanTypes.PERSONAL][PlanDurations.ANNUALLY],
    },
  },
  [PlanTypes.BUSINESS]: {
    [PlanDurations.MONTHLY]: {
      title: 'Paid Business Plan Monthly',
      cost: defaultPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY],
    },
    [PlanDurations.ANNUALLY]: {
      title: 'Paid Business Plan Annually',
      cost: defaultPlanPrices[PlanTypes.BUSINESS][PlanDurations.ANNUALLY],
    },
  },
  [ApiPlanTypes.GOLD]: {
    [PlanDurations.MONTHLY]: {
      title: 'Paid Gold Plan Monthly',
      cost: 49,
    },
    [PlanDurations.ANNUALLY]: {
      title: 'Paid Gold Plan Annually',
      cost: 470,
    },
  },
  [ApiPlanTypes.PLATINUM]: {
    [PlanDurations.MONTHLY]: {
      title: 'Paid Platinum Plan Monthly',
      cost: 99,
    },
    [PlanDurations.ANNUALLY]: {
      title: 'Paid Platinum Plan Annually',
      cost: 950,
    },
  },
  [ApiPlanTypes.TITANIUM]: {
    [PlanDurations.MONTHLY]: {
      title: 'Paid Titanium Plan Monthly',
      cost: 199,
    },
    [PlanDurations.ANNUALLY]: {
      title: 'Paid Titanium Plan Annually',
      cost: 1910,
    },
  },
};

export enum InvoiceTypes {
  API = 'api',
  DEFAULT = 'default',
  LTD = 'ltd',
}

export interface InvoicesRequest extends PaginationParams, OrderingParams {
  types: InvoiceTypes[];
}

export interface InvoicesData {
  invoices: NormalizedEntity<Invoice>;
  paginationData: PaginationData;
}

export type Coupon = DiscountData;

export interface InvoiceDownloadLink {
  invoiceId: Invoice['id'];
  hash: string;
}

export interface InvoiceDownloadLinkPayload {
  result: string;
}

export interface ChangeLtdPlanDurationPayload {
  duration: PlanDurations;
}

export interface LtdPaymentCheckoutPayload {
  successUrl: string;
  cancelUrl: string;
  ltdId: string;
}

export interface CreateLtdPaymentCheckoutPayload extends LtdPaymentCheckoutPayload {
  email: string;
}

export interface LtdCheckoutResponse {
  stripeCheckoutUrl: string;
  paypalOrderId: string;
  amount: number;
  discountAmount: number;
  total: number;
}

export interface LtdCheckoutUpgradeResponse extends LtdCheckoutResponse {
  currentTier: LtdTier;
  newTier: LtdTier;
}

export interface CapturePaypalOrderPayload {
  orderId: string;
}

export interface LtdTier {
  id: LtdTiersIds;
  name: string;
  teammatesLimit: number;
  formsLimit: number;
  bulkSendLimit: number;
  plan: Plan;
  apiPlan: ApiPlanInfo;
  price: number;
  tierNumber?: number;
  planType: PlanTypes;
}

export interface GetLtdTierPayload {
  ltdId: string;
}

export interface CapturePaypalOrderPayload {
  orderId: string;
}

export interface LtdCodePayload {
  code: string;
}

export enum LtdTypes {
  APPSUMO = 'appsumo',
  TIER = 'tier',
  NONE = 'none',
}
