/* eslint-disable */
import { User } from 'Interfaces/User';
import { NODE_ENV } from 'Utils/constants';
import { formatDateToHumanString } from 'Utils/formatters';
import { AnalyticsData, EcommerceItem } from './Interfaces';

declare var dataLayer;

class DataLayerAnalytics {
  push = (data: AnalyticsData) => {
    if (NODE_ENV === 'production') {
      dataLayer.push(data);
    }
  };

  fireUnconfirmedRegistrationEvent = (userId: string) => {
    this.push({
      event: 'unconfirmedstatus',
      CreateFreeAccount: 'Free Account Registration',
      userId,
    });
  };

  fireAppSumoRegistrationEvent = () => {
    this.push({
      event: 'appsumoregistration',
      RegistrationAppSumo: 'AppSumoReg',
    });
  };

  fireConfirmedRegistrationEvent = (userId: string) => {
    this.push({
      event: 'confirmedstatus',
      ConfirmedAccount: 'Confirmed Account',
      userId,
    });
  };

  fireGoogleRegistrationEvent = () => {
    this.push({
      event: 'confirmedstatus',
      ConfirmedAccount: 'Confirmed Account (SIGN UP with GOOGLE)',
    });
  };

  fireUserIdEvent = (user: User) => {
    this.push({
      event: 'userId',
      userId: user.id,
      registrationDate:
        user.createdAt && formatDateToHumanString(user.createdAt.toString(), true),
      userType: user.plan.type,
      billingPeriod: user.plan.duration,
      appSumo: !!(user.appSumoStatus),
      teamId: user.teamId,
      role: user.role,
    });
  };

  fireSubscriptionEvent = (planName: string, transactionId: string) => {
    this.push({
      event: 'subscription',
      PricingPlanName: planName,
      transactionID: transactionId,
    });
  };

  firePurchaseEvent = ({
    transaction_id,
    previous_plan_name,
    count_of_docs_saved,
    item,
  }: {
    transaction_id: string;
    previous_plan_name: string;
    count_of_docs_saved: number;
    item: EcommerceItem;
  }) => {
    this.push({
      event: 'purchase',
      ecommerce: {
        transaction_id,
        previous_plan_name,
        count_of_docs_saved,
        items: [{ ...item, affiliation: 'Signaturely', item_brand: 'Signaturely' }],
      },
    });
  };

  fireTrialSignUpEvent = (userId: string) => {
    this.push({
      event: 'trialregistration',
      ConfirmedAccount: 'Confirmed Account (Sign Up with Trial)',
      userId,
    });
  };
}

export default new DataLayerAnalytics();
