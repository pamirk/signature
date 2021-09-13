import { createReducer } from 'typesafe-actions';
import {
  getCard,
  updateCard,
  createCard,
  getPlans,
  getInvoices,
  getSubscriptionData,
  getApiSubscription,
  removeApiPlan,
  changeApiPlan,
} from './actionCreators';
import { BillingData, PlanDetails } from 'Interfaces/Billing';

export default createReducer({
  invoiceItems: {},
  subscriptionData: {},
  plans: [] as PlanDetails[],
  card: {},
} as BillingData)
  .handleAction(
    [getCard.success, updateCard.success, createCard.success],
    (state, action) => ({
      ...state,
      card: action.payload,
    }),
  )
  .handleAction([getInvoices.success], (state, action) => ({
    ...state,
    invoices: action.payload,
  }))
  .handleAction([getPlans.success], (state, action) => ({
    ...state,
    plans: action.payload,
  }))
  .handleAction([getSubscriptionData.success], (state, action) => ({
    ...state,
    subscriptionData: action.payload,
  }))
  .handleAction([getApiSubscription.success], (state, action) => ({
    ...state,
    apiSubscription: action.payload,
  }))
  .handleAction([removeApiPlan.success, changeApiPlan.success], (state, action) => ({
    ...state,
    apiSubscription: action.payload,
  }));
