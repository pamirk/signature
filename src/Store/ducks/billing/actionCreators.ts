import { createAsyncAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from '@/Interfaces/ActionCreators.ts';

import { promisifyAsyncAction } from 'Utils/functions';
import {
  GetCardActionTypes,
  UpdateCardActionTypes,
  GetInvoicesActionTypes,
  ChangePLanActionTypes,
  AttachCardActionTypes,
  GetPlansActionTypes,
  GetSubscriptionDataActionTypes,
  GetApiSubscriptionActionTypes,
  UpgradeAppSumoActionTypes,
  ChangeApiPLanActionTypes,
  RemoveApiPlanActionTypes,
  RetryChargeActionTypes,
  UpsellPlanActionTypes,
  ValidatePromotionCodeActionTypes,
  GetLastestInvoiceActionTypes,
  CreateSetupCheckoutSession,
  CreateSubscriptionCheckout,
  CheckUpsellAllowed,
  CreateBillingPortal,
  GetUpcomingInvoice,
  GetInvoiceDownloadLink,
  GetLtdUpcomingInvoice,
  ChangeLtdPlanDurationTypes,
  CreateLtdPaymentCheckout,
  GetLtdTier,
  GetLtdTiers,
  CapturePaypalOrder,
  UpgradeLtdPaymentCheckout,
  ValidateLtdCode,
  RedeemLtdCode,
  TemporaryChangePlanActionTypes,
  CancelPlanActionTypes,
} from './actionTypes';
import {
  CardPayload,
  Card,
  PlanChangePayload,
  PlanDetails,
  SubscriptionData,
  AppSumoUpgradePayload,
  ApiPlanChangePayload,
  ApiSubscription,
  GetLatestInvoicePayload,
  DiscountData,
  ValidatePromotionCodePayload,
  CreateSubscriptionCheckoutPayload,
  CheckoutSessionUrl,
  GetUpcomingInvoicePayload,
  InvoiceDownloadLinkPayload,
  InvoiceDownloadLink,
  ChangeLtdPlanDurationPayload,
  InvoicesRequest,
  InvoicesData,
  CreateLtdPaymentCheckoutPayload,
  CapturePaypalOrderPayload,
  LtdTier,
  GetLtdTierPayload,
  LtdCheckoutResponse,
  LtdPaymentCheckoutPayload,
  LtdCheckoutUpgradeResponse,
  LtdCodePayload,
  PlanCancelPayload,
} from 'Interfaces/Billing';
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

export const attachCard = createAsyncAction(
  AttachCardActionTypes.request,
  AttachCardActionTypes.success,
  AttachCardActionTypes.failure,
  AttachCardActionTypes.cancel,
)<
  [CardPayload, PromisifiedActionMeta],
  [Card, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $attachCard = promisifyAsyncAction(attachCard);

export const getInvoices = createAsyncAction(
  GetInvoicesActionTypes.request,
  GetInvoicesActionTypes.success,
  GetInvoicesActionTypes.failure,
  GetInvoicesActionTypes.cancel,
)<
  [InvoicesRequest, PromisifiedActionMeta],
  [InvoicesData, PromisifiedActionMeta],
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

export const cancelPlan = createAsyncAction(
  CancelPlanActionTypes.request,
  CancelPlanActionTypes.success,
  CancelPlanActionTypes.failure,
  CancelPlanActionTypes.cancel,
)<
  [PlanCancelPayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $cancelPlan = promisifyAsyncAction(cancelPlan);

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

export const retryCharge = createAsyncAction(
  RetryChargeActionTypes.request,
  RetryChargeActionTypes.success,
  RetryChargeActionTypes.failure,
  RetryChargeActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [SubscriptionData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $retryCharge = promisifyAsyncAction(retryCharge);

export const upsellPlan = createAsyncAction(
  UpsellPlanActionTypes.request,
  UpsellPlanActionTypes.success,
  UpsellPlanActionTypes.failure,
  UpsellPlanActionTypes.cancel,
)<
  [PlanChangePayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $upsellPlan = promisifyAsyncAction(upsellPlan);

export const validatePromotionCode = createAsyncAction(
  ValidatePromotionCodeActionTypes.request,
  ValidatePromotionCodeActionTypes.success,
  ValidatePromotionCodeActionTypes.failure,
  ValidatePromotionCodeActionTypes.cancel,
)<
  [ValidatePromotionCodePayload, PromisifiedActionMeta],
  [DiscountData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $validatePromotionCode = promisifyAsyncAction(validatePromotionCode);

export const getLatestInvoice = createAsyncAction(
  GetLastestInvoiceActionTypes.request,
  GetLastestInvoiceActionTypes.success,
  GetLastestInvoiceActionTypes.failure,
  GetLastestInvoiceActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [GetLatestInvoicePayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getLatestInvoice = promisifyAsyncAction(getLatestInvoice);

export const creatSetupCheckoutSession = createAsyncAction(
  CreateSetupCheckoutSession.request,
  CreateSetupCheckoutSession.success,
  CreateSetupCheckoutSession.failure,
  CreateSetupCheckoutSession.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [CheckoutSessionUrl, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $creatSetupCheckoutSession = promisifyAsyncAction(creatSetupCheckoutSession);

export const createSubscriptionCheckout = createAsyncAction(
  CreateSubscriptionCheckout.request,
  CreateSubscriptionCheckout.success,
  CreateSubscriptionCheckout.failure,
  CreateSubscriptionCheckout.cancel,
)<
  [CreateSubscriptionCheckoutPayload, PromisifiedActionMeta],
  [CheckoutSessionUrl, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createSubscriptionCheckout = promisifyAsyncAction(
  createSubscriptionCheckout,
);

export const checkUpsellAllowed = createAsyncAction(
  CheckUpsellAllowed.request,
  CheckUpsellAllowed.success,
  CheckUpsellAllowed.failure,
  CheckUpsellAllowed.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [string, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $checkUpsellAllowed = promisifyAsyncAction(checkUpsellAllowed);

export const createBillingPortal = createAsyncAction(
  CreateBillingPortal.request,
  CreateBillingPortal.success,
  CreateBillingPortal.failure,
  CreateBillingPortal.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [CheckoutSessionUrl, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createBillingPortal = promisifyAsyncAction(createBillingPortal);

export const getUpcomingInvoice = createAsyncAction(
  GetUpcomingInvoice.request,
  GetUpcomingInvoice.success,
  GetUpcomingInvoice.failure,
  GetUpcomingInvoice.cancel,
)<
  [CreateSubscriptionCheckoutPayload, PromisifiedActionMeta],
  [GetUpcomingInvoicePayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getUpcomingInvoice = promisifyAsyncAction(getUpcomingInvoice);

export const getLtdUpcomingInvoice = createAsyncAction(
  GetLtdUpcomingInvoice.request,
  GetLtdUpcomingInvoice.success,
  GetLtdUpcomingInvoice.failure,
  GetLtdUpcomingInvoice.cancel,
)<
  [CreateSubscriptionCheckoutPayload, PromisifiedActionMeta],
  [GetUpcomingInvoicePayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getLtdUpcomingInvoice = promisifyAsyncAction(getLtdUpcomingInvoice);

export const getInvoiceDownloadLink = createAsyncAction(
  GetInvoiceDownloadLink.request,
  GetInvoiceDownloadLink.success,
  GetInvoiceDownloadLink.failure,
  GetInvoiceDownloadLink.cancel,
)<
  [InvoiceDownloadLink, PromisifiedActionMeta],
  [InvoiceDownloadLinkPayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getInvoiceDownloadLink = promisifyAsyncAction(getInvoiceDownloadLink);

export const changeLtdPlanDuration = createAsyncAction(
  ChangeLtdPlanDurationTypes.request,
  ChangeLtdPlanDurationTypes.success,
  ChangeLtdPlanDurationTypes.failure,
  ChangeLtdPlanDurationTypes.cancel,
)<
  [ChangeLtdPlanDurationPayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $changeLtdPlanDuration = promisifyAsyncAction(changeLtdPlanDuration);

export const createLtdPaymentCheckout = createAsyncAction(
  CreateLtdPaymentCheckout.request,
  CreateLtdPaymentCheckout.success,
  CreateLtdPaymentCheckout.failure,
  CreateLtdPaymentCheckout.cancel,
)<
  [CreateLtdPaymentCheckoutPayload, PromisifiedActionMeta],
  [LtdCheckoutResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $createLtdPaymentCheckout = promisifyAsyncAction(createLtdPaymentCheckout);

export const upgradeLtdPaymentCheckout = createAsyncAction(
  UpgradeLtdPaymentCheckout.request,
  UpgradeLtdPaymentCheckout.success,
  UpgradeLtdPaymentCheckout.failure,
  UpgradeLtdPaymentCheckout.cancel,
)<
  [LtdPaymentCheckoutPayload, PromisifiedActionMeta],
  [LtdCheckoutUpgradeResponse, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $upgradeLtdPaymentCheckout = promisifyAsyncAction(upgradeLtdPaymentCheckout);

export const capturePaypalOrder = createAsyncAction(
  CapturePaypalOrder.request,
  CapturePaypalOrder.success,
  CapturePaypalOrder.failure,
  CapturePaypalOrder.cancel,
)<
  [CapturePaypalOrderPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $capturePaypalOrder = promisifyAsyncAction(capturePaypalOrder);

export const getLtdTier = createAsyncAction(
  GetLtdTier.request,
  GetLtdTier.success,
  GetLtdTier.failure,
  GetLtdTier.cancel,
)<
  [GetLtdTierPayload, PromisifiedActionMeta],
  [LtdTier, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getLtdTier = promisifyAsyncAction(getLtdTier);

export const getLtdTiers = createAsyncAction(
  GetLtdTiers.request,
  GetLtdTiers.success,
  GetLtdTiers.failure,
  GetLtdTiers.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [LtdTier[], PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getLtdTiers = promisifyAsyncAction(getLtdTiers);

export const validateLtdCode = createAsyncAction(
  ValidateLtdCode.request,
  ValidateLtdCode.success,
  ValidateLtdCode.failure,
  ValidateLtdCode.cancel,
)<
  [LtdCodePayload, PromisifiedActionMeta],
  [LtdTier, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $validateLtdCode = promisifyAsyncAction(validateLtdCode);

export const redeemLtdCode = createAsyncAction(
  RedeemLtdCode.request,
  RedeemLtdCode.success,
  RedeemLtdCode.failure,
  RedeemLtdCode.cancel,
)<
  [LtdCodePayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $redeemLtdCode = promisifyAsyncAction(redeemLtdCode);

export const temporaryChangePlan = createAsyncAction(
  TemporaryChangePlanActionTypes.request,
  TemporaryChangePlanActionTypes.success,
  TemporaryChangePlanActionTypes.failure,
  TemporaryChangePlanActionTypes.cancel,
)<
  [PlanChangePayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $temporaryChangePlan = promisifyAsyncAction(temporaryChangePlan);
