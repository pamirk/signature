import { AxiosRequestConfig } from 'axios';
import {
  Card,
  CardFormValues,
  Invoice,
  PlanDetails,
  SubscriptionData,
  PlanChangePayload,
  AppSumoUpgradePayload,
  ApiPlanChangePayload,
  InvoiceTypes,
} from 'Interfaces/Billing';
import { User } from 'Interfaces/User';
import Api from './Api';

class BillingApi extends Api {
  getCreditCard = (config?: AxiosRequestConfig) => {
    return this.request.get()<Card>('credit-card', { ...config });
  };

  updateCard = (values: CardFormValues) => {
    return this.request.patch()<Card>('credit-card', values);
  };

  createCard = (values: CardFormValues) => {
    return this.request.post()<Card>('credit-card', values);
  };

  changePlan = async (payload: PlanChangePayload) =>
    this.request.post()<User>('plans/change', payload);

  changeApiPlan = async (payload: ApiPlanChangePayload) =>
    this.request.post()<User>('api-plans/change', payload);

  removeApiPlan = async () => this.request.delete()<User>('api-plans');

  getInvoices = async (type: InvoiceTypes) =>
    this.request.get()<Invoice[]>('invoices', { params: { type } });

  getSubscriptionData = () => this.request.get()<SubscriptionData>('subscriptions');

  getApiSubscription = () => this.request.get()<SubscriptionData>('api-subscriptions');

  getPlans = () => this.request.get()<PlanDetails[]>('plans');

  cancelSubscription = () => this.request.post()('subscriptions/cancel');

  upgradeAppSumo = (payload: AppSumoUpgradePayload) =>
    this.request.post()('plans/upgrade_appsumo', payload);
}

export default new BillingApi();
