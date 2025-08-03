import { AxiosRequestConfig } from 'axios';
import {
  Card,
  PlanDetails,
  SubscriptionData,
  PlanChangePayload,
  AppSumoUpgradePayload,
  ApiPlanChangePayload,
  ValidatePromotionCodePayload,
  CreateSubscriptionCheckoutPayload,
  ChangeLtdPlanDurationPayload,
  InvoicesRequest,
  CreateLtdPaymentCheckoutPayload,
  GetLtdTierPayload,
  CapturePaypalOrderPayload,
  LtdPaymentCheckoutPayload,
  LtdCodePayload,
  PlanCancelPayload,
} from 'Interfaces/Billing';
import { User } from 'Interfaces/User';
import { getWorkflowVersion } from 'Utils/functions';
import Api from './Api';

class BillingApi extends Api {
  getCreditCard = (config?: AxiosRequestConfig) => {
    return this.request.get()<Card>('credit-card', { ...config });
  };

  updateCard = (token: string) => {
    return this.request.patch()<Card>('credit-card', { token });
  };

  attachCard = (token: string) => {
    return this.request.post()<Card>('credit-card', { token });
  };

  changePlan = async (payload: PlanChangePayload) =>
    this.request.post()<User>('plans/change', payload);

  cancelPlan = async (payload: PlanCancelPayload) =>
    this.request.post()<User>('plans/cancel', payload);

  changeApiPlan = async (payload: ApiPlanChangePayload) =>
    this.request.post()<User>('api-plans/change', payload);

  removeApiPlan = async () => this.request.delete()<User>('api-plans');

  getInvoices = async (payload: InvoicesRequest) =>
    this.request.get()('invoices', { params: payload });

  getSubscriptionData = () => this.request.get()<SubscriptionData>('subscriptions');

  getApiSubscription = () => this.request.get()<SubscriptionData>('api-subscriptions');

  getPlans = () => this.request.get()<PlanDetails[]>('plans');

  cancelSubscription = () => this.request.post()('subscriptions/cancel');

  upgradeAppSumo = (payload: AppSumoUpgradePayload) =>
    this.request.post()('plans/upgrade_appsumo', payload);

  retryCharge = () => this.request.patch()('plans/retry_charge');

  upsellPlan = () => this.request.patch()('plans/upsell');

  validatePromotionCode = (payload: ValidatePromotionCodePayload) =>
    this.request.patch()(`discounts/check_code`, payload);

  validatePromotionCodeUnauthorized = (payload: ValidatePromotionCodePayload) =>
    this.request.patch()(`discounts/unauthorized/check_code`, payload);

  getLatestInvoice = () => this.request.get()('invoices/last_invoice');

  createSetupCheckout = () => {
    return this.request.get()('create_checkout/setup', {
      params: { workflowVersion: getWorkflowVersion() },
    });
  };

  createSubscriptionCheckout = (payload: CreateSubscriptionCheckoutPayload) => {
    return this.request.get()('create_checkout/subscription', {
      params: { ...payload, workflowVersion: getWorkflowVersion() },
    });
  };

  checkUpsellAllowed = () => {
    return this.request.get()('plans/upsell_allowed');
  };

  createBillingPortal = () => {
    return this.request.get()('create_checkout/billing_portal');
  };

  getUpcomingInvoice = (payload: CreateSubscriptionCheckoutPayload) => {
    return this.request.get()('invoices/upcoming', { params: payload });
  };

  getLtdUpcomingInvoice = (payload: CreateSubscriptionCheckoutPayload) => {
    return this.request.get()('invoices/upcoming_ltd', { params: payload });
  };

  getInvoiceDownloadLink = ({ invoiceId, hash }) => {
    return this.request.get()(`invoices/${invoiceId}/download?hash=${hash}`);
  };

  changeLtdPlanDuration = (payload: ChangeLtdPlanDurationPayload) =>
    this.request.patch()(`plans/ltd_duration`, payload);

  createLtdPaymentCheckout = (payload: CreateLtdPaymentCheckoutPayload) => {
    return this.request.get()('create_checkout/ltd', {
      params: payload,
    });
  };

  upgradeLtdPaymentCheckout = (payload: LtdPaymentCheckoutPayload) => {
    return this.request.get()('create_checkout/ltd_upgrade', {
      params: payload,
    });
  };

  capturePaypalOrder = (payload: CapturePaypalOrderPayload) => {
    return this.request.post()(`create_checkout/${payload.orderId}/capture`);
  };

  getLtdTier = (payload: GetLtdTierPayload) => {
    return this.request.get()(`ltd-tiers/${payload.ltdId}`);
  };

  getLtdTiers = () => {
    return this.request.get()('ltd-tiers');
  };

  validateLtdCode = (payload: LtdCodePayload) => {
    return this.request.post()(`ltd-tiers/validate_code`, payload);
  };

  redeemLtdCode = (payload: LtdCodePayload) => {
    return this.request.post()(`ltd-tiers/activate`, payload);
  };

  temporaryChangePlan = async (payload: PlanChangePayload) =>
    this.request.post()<User>('plans/change', payload);
}

export default new BillingApi();
