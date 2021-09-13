import { createAsyncAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from 'Interfaces/ActionCreators';

import { promisifyAsyncAction } from 'Utils/functions';
import {
  GetCardActionTypes,
  UpdateCardActionTypes,
  GetInvoicesActionTypes,
  ChangePLanActionTypes,
  CreateCardActionTypes,
  GetPlansActionTypes,
  GetSubscriptionDataActionTypes,
  GetApiSubscriptionActionTypes,
  UpgradeAppSumoActionTypes,
  ChangeApiPLanActionTypes,
  RemoveApiPlanActionTypes,
} from './actionTypes';
import {
  CardPayload,
  Card,
  PlanChangePayload,
  PlanDetails,
  Invoice,
  SubscriptionData,
  AppSumoUpgradePayload,
  ApiPlanChangePayload,
  InvoiceTypes,
  ApiSubscription,
} from 'Interfaces/Billing';
import { NormalizedEntity } from 'Interfaces/Common';
import { User } from 'Interfaces/User';

export const getCard = createAsyncAction(
  GetCardActionTypes.request,
  GetCardActionTypes.success,
  GetCardActionTypes.failure,
  GetCardActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [Card, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getCard = promisifyAsyncAction(getCard);

export const updateCard = createAsyncAction(
  UpdateCardActionTypes.request,
  UpdateCardActionTypes.success,
  UpdateCardActionTypes.failure,
  UpdateCardActionTypes.cancel,
)<
  [CardPayload, PromisifiedActionMeta],
  [Card, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $updateCard = promisifyAsyncAction(updateCard);

export const createCard = createAsyncAction(
  CreateCardActionTypes.request,
  CreateCardActionTypes.success,
  CreateCardActionTypes.failure,
  CreateCardActionTypes.cancel,
)<
  [CardPayload, PromisifiedActionMeta],
  [Card, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createCard = promisifyAsyncAction(createCard);

export const getInvoices = createAsyncAction(
  GetInvoicesActionTypes.request,
  GetInvoicesActionTypes.success,
  GetInvoicesActionTypes.failure,
  GetInvoicesActionTypes.cancel,
)<
  [InvoiceTypes, PromisifiedActionMeta],
  [NormalizedEntity<Invoice>, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getInvoices = promisifyAsyncAction(getInvoices);

export const getPlans = createAsyncAction(
  GetPlansActionTypes.request,
  GetPlansActionTypes.success,
  GetPlansActionTypes.failure,
  GetPlansActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [PlanDetails[], PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getPlans = promisifyAsyncAction(getPlans);

export const changePLan = createAsyncAction(
  ChangePLanActionTypes.request,
  ChangePLanActionTypes.success,
  ChangePLanActionTypes.failure,
  ChangePLanActionTypes.cancel,
)<
  [PlanChangePayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $changePLan = promisifyAsyncAction(changePLan);

export const changeApiPlan = createAsyncAction(
  ChangeApiPLanActionTypes.request,
  ChangeApiPLanActionTypes.success,
  ChangeApiPLanActionTypes.failure,
  ChangeApiPLanActionTypes.cancel,
)<
  [ApiPlanChangePayload, PromisifiedActionMeta],
  [ApiSubscription, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $changeApiPlan = promisifyAsyncAction(changeApiPlan);

export const removeApiPlan = createAsyncAction(
  RemoveApiPlanActionTypes.request,
  RemoveApiPlanActionTypes.success,
  RemoveApiPlanActionTypes.failure,
  RemoveApiPlanActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [ApiSubscription, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $removeApiPlan = promisifyAsyncAction(removeApiPlan);

export const upgradeAppSumo = createAsyncAction(
  UpgradeAppSumoActionTypes.request,
  UpgradeAppSumoActionTypes.success,
  UpgradeAppSumoActionTypes.failure,
  UpgradeAppSumoActionTypes.cancel,
)<
  [AppSumoUpgradePayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $upgradeAppSumo = promisifyAsyncAction(upgradeAppSumo);

export const getSubscriptionData = createAsyncAction(
  GetSubscriptionDataActionTypes.request,
  GetSubscriptionDataActionTypes.success,
  GetSubscriptionDataActionTypes.failure,
  GetSubscriptionDataActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [SubscriptionData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getSubscriptionData = promisifyAsyncAction(getSubscriptionData);

export const getApiSubscription = createAsyncAction(
  GetApiSubscriptionActionTypes.request,
  GetApiSubscriptionActionTypes.success,
  GetApiSubscriptionActionTypes.failure,
  GetApiSubscriptionActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [ApiSubscription, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getApiSubscription = promisifyAsyncAction(getApiSubscription);
