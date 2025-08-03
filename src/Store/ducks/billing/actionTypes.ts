export enum GetCardActionTypes {
  request = 'billing/GET_CARD_CREDITALS/REQUEST',
  success = 'billing/GET_CARD_CREDITALS/SUCCESS',
  failure = 'billing/GET_CARD_CREDITALS/FAILURE',
  cancel = 'billing/GET_CARD_CREDITALS/CANCEL',
}

export enum GetBillingDataActionTypes {
  request = 'billing/GET_BILLING_DATA/REQUEST',
  success = 'billing/GET_BILLING_DATA/SUCCESS',
  failure = 'billing/GET_BILLING_DATA/FAILURE',
  cancel = 'billing/GET_BILLING_DATA/CANCEL',
}

export enum UpdateCardActionTypes {
  request = 'billing/UPDATE_CARD/REQUEST',
  success = 'billing/UPDATE_CARD/SUCCESS',
  failure = 'billing/UPDATE_CARD/FAILURE',
  cancel = 'billing/UPDATE_CARD/CANCEL',
}

export enum AttachCardActionTypes {
  request = 'billing/CREATE_CARD/REQUEST',
  success = 'billing/CREATE_CARD/SUCCESS',
  failure = 'billing/CREATE_CARD/FAILURE',
  cancel = 'billing/CREATE_CARD/CANCEL',
}

export enum GetInvoicesActionTypes {
  request = 'billing/GET_INVOICES/REQUEST',
  success = 'billing/GET_INVOICES/SUCCESS',
  failure = 'billing/GET_INVOICES/FAILURE',
  cancel = 'billing/GET_INVOICES/CANCEL',
}

export enum GetPlansActionTypes {
  request = 'billing/GET_PLANS/REQUEST',
  success = 'billing/GET_PLANS/SUCCESS',
  failure = 'billing/GET_PLANS/FAILURE',
  cancel = 'billing/GET_PLANS/CANCEL',
}

export enum ChangePLanActionTypes {
  request = 'billing/CHANGE_PLAN/REQUEST',
  success = 'billing/CHANGE_PLAN/SUCCESS',
  failure = 'billing/CHANGE_PLAN/FAILURE',
  cancel = 'billing/CHANGE_PLAN/CANCEL',
}

export enum CancelPlanActionTypes {
  request = 'billing/CANCEL_PLAN/REQUEST',
  success = 'billing/CANCEL_PLAN/SUCCESS',
  failure = 'billing/CANCEL_PLAN/FAILURE',
  cancel = 'billing/CANCEL_PLAN/CANCEL',
}

export enum ChangeApiPLanActionTypes {
  request = 'billing/CHANGE_API_PLAN/REQUEST',
  success = 'billing/CHANGE_API_PLAN/SUCCESS',
  failure = 'billing/CHANGE_API_PLAN/FAILURE',
  cancel = 'billing/CHANGE_API_PLAN/CANCEL',
}

export enum RemoveApiPlanActionTypes {
  request = 'billing/REMOVE_API_PLAN/REQUEST',
  success = 'billing/REMOVE_API_PLAN/SUCCESS',
  failure = 'billing/REMOVE_API_PLAN/FAILURE',
  cancel = 'billing/REMOVE_API_PLAN/CANCEL',
}

export enum UpgradeAppSumoActionTypes {
  request = 'billing/UPGRADE_APPSUMO/REQUEST',
  success = 'billing/UPGRADE_APPSUMO/SUCCESS',
  failure = 'billing/UPGRADE_APPSUMO/FAILURE',
  cancel = 'billing/UPGRADE_APPSUMO/CANCEL',
}

export enum GetSubscriptionDataActionTypes {
  request = 'billing/GET_SUBSCRIPTION_DATA/REQUEST',
  success = 'billing/GET_SUBSCRIPTION_DATA/SUCCESS',
  failure = 'billing/GET_SUBSCRIPTION_DATA/FAILURE',
  cancel = 'billing/GET_SUBSCRIPTION_DATA/CANCEL',
}

export enum GetApiSubscriptionActionTypes {
  request = 'billing/GET_API_SUBSCRIPTION_DATA/REQUEST',
  success = 'billing/GET_API_SUBSCRIPTION_DATA/SUCCESS',
  failure = 'billing/GET_API_SUBSCRIPTION_DATA/FAILURE',
  cancel = 'billing/GET_API_SUBSCRIPTION_DATA/CANCEL',
}

export enum RetryChargeActionTypes {
  request = 'billing/RETRY_CHARGE/REQUEST',
  success = 'billing/RETRY_CHARGE/SUCCESS',
  failure = 'billing/RETRY_CHARGE/FAILURE',
  cancel = 'billing/RETRY_CHARGE/CANCEL',
}

export enum UpsellPlanActionTypes {
  request = 'billing/UPSELL_PLAN/REQUEST',
  success = 'billing/UPSELL_PLAN/SUCCESS',
  failure = 'billing/UPSELL_PLAN/FAILURE',
  cancel = 'billing/UPSELL_PLAN/CANCEL',
}

export enum ValidatePromotionCodeActionTypes {
  request = 'billing/VALIDATE_PROMOTION_CODE/REQUEST',
  success = 'billing/VALIDATE_PROMOTION_CODE/SUCCESS',
  failure = 'billing/VALIDATE_PROMOTION_CODE/FAILURE',
  cancel = 'billing/VALIDATE_PROMOTION_CODE/CANCEL',
}

export enum GetLastestInvoiceActionTypes {
  request = 'billing/GET_LATEST_INVOICE/REQUEST',
  success = 'billing/GET_LATEST_INVOICE/SUCCESS',
  failure = 'billing/GET_LATEST_INVOICE/FAILURE',
  cancel = 'billing/GET_LATEST_INVOICE/CANCEL',
}

export enum CreateSetupCheckoutSession {
  request = 'billing/CREATE_SETUP_CHECKOUT/REQUEST',
  success = 'billing/CREATE_SETUP_CHECKOUT/SUCCESS',
  failure = 'billing/CREATE_SETUP_CHECKOUT/FAILURE',
  cancel = 'billing/CREATE_SETUP_CHECKOUT/CANCEL',
}

export enum CreateSubscriptionCheckout {
  request = 'billing/CREATE_SUBSCRIPTION_CHECKOUT/REQUEST',
  success = 'billing/CREATE_SUBSCRIPTION_CHECKOUT/SUCCESS',
  failure = 'billing/CREATE_SUBSCRIPTION_CHECKOUT/FAILURE',
  cancel = 'billing/CREATE_SUBSCRIPTION_CHECKOUT/CANCEL',
}

export enum CheckUpsellAllowed {
  request = 'billing/CHECK_UPSELL_ALLOWED/REQUEST',
  success = 'billing/CHECK_UPSELL_ALLOWED/SUCCESS',
  failure = 'billing/CHECK_UPSELL_ALLOWED/FAILURE',
  cancel = 'billing/CHECK_UPSELL_ALLOWED/CANCEL',
}

export enum CreateBillingPortal {
  request = 'billing/CREATE_BILLING_PORTAL/REQUEST',
  success = 'billing/CREATE_BILLING_PORTAL/SUCCESS',
  failure = 'billing/CREATE_BILLING_PORTAL/FAILURE',
  cancel = 'billing/CREATE_BILLING_PORTAL/CANCEL',
}

export enum GetUpcomingInvoice {
  request = 'billing/GET_UPCOMING_INVOICE/REQUEST',
  success = 'billing/GET_UPCOMING_INVOICE/SUCCESS',
  failure = 'billing/GET_UPCOMING_INVOICE/FAILURE',
  cancel = 'billing/GET_UPCOMING_INVOICE/CANCEL',
}

export enum GetLtdUpcomingInvoice {
  request = 'billing/GET_LTD_UPCOMING_INVOICE/REQUEST',
  success = 'billing/GET_LTD_UPCOMING_INVOICE/SUCCESS',
  failure = 'billing/GET_LTD_UPCOMING_INVOICE/FAILURE',
  cancel = 'billing/GET_LTD_UPCOMING_INVOICE/CANCEL',
}

export enum GetInvoiceDownloadLink {
  request = 'billing/GET_INVOICE_DONWLOAD_LINK/REQUEST',
  success = 'billing/GET_INVOICE_DONWLOAD_LINK/SUCCESS',
  failure = 'billing/GET_INVOICE_DONWLOAD_LINK/FAILURE',
  cancel = 'billing/GET_INVOICE_DONWLOAD_LINK/CANCEL',
}

export enum ChangeLtdPlanDurationTypes {
  request = 'billing/CHANGE_LTD_PLAN_DURATION/REQUEST',
  success = 'billing/CHANGE_LTD_PLAN_DURATION/SUCCESS',
  failure = 'billing/CHANGE_LTD_PLAN_DURATION/FAILURE',
  cancel = 'billing/CHANGE_LTD_PLAN_DURATION/CANCEL',
}

export enum CreateLtdPaymentCheckout {
  request = 'billing/CREATE_LTD_PAYMENT_CHECKOUT/REQUEST',
  success = 'billing/CREATE_LTD_PAYMENT_CHECKOUT/SUCCESS',
  failure = 'billing/CREATE_LTD_PAYMENT_CHECKOUT/FAILURE',
  cancel = 'billing/CREATE_LTD_PAYMENT_CHECKOUT/CANCEL',
}

export enum UpgradeLtdPaymentCheckout {
  request = 'billing/UPGRADE_LTD_PAYMENT_CHECKOUT/REQUEST',
  success = 'billing/UPGRADE_LTD_PAYMENT_CHECKOUT/SUCCESS',
  failure = 'billing/UPGRADE_LTD_PAYMENT_CHECKOUT/FAILURE',
  cancel = 'billing/UPGRADE_LTD_PAYMENT_CHECKOUT/CANCEL',
}

export enum CapturePaypalOrder {
  request = 'billing/CAPTURE_PAYPAL_ORDER/REQUEST',
  success = 'billing/CAPTURE_PAYPAL_ORDER/SUCCESS',
  failure = 'billing/CAPTURE_PAYPAL_ORDER/FAILURE',
  cancel = 'billing/CAPTURE_PAYPAL_ORDER/CANCEL',
}

export enum GetLtdTier {
  request = 'billing/GET_LTD_TIER/REQUEST',
  success = 'billing/GET_LTD_TIER/SUCCESS',
  failure = 'billing/GET_LTD_TIER/FAILURE',
  cancel = 'billing/GET_LTD_TIER/CANCEL',
}

export enum GetLtdTiers {
  request = 'billing/GET_LTD_TIERS/REQUEST',
  success = 'billing/GET_LTD_TIERS/SUCCESS',
  failure = 'billing/GET_LTD_TIERS/FAILURE',
  cancel = 'billing/GET_LTD_TIERS/CANCEL',
}

export enum ValidateLtdCode {
  request = 'billing/VALIDATE_LTD_CODE/REQUEST',
  success = 'billing/VALIDATE_LTD_CODE/SUCCESS',
  failure = 'billing/VALIDATE_LTD_CODE/FAILURE',
  cancel = 'billing/VALIDATE_LTD_CODE/CANCEL',
}

export enum RedeemLtdCode {
  request = 'billing/REDEEM_LTD_CODE/REQUEST',
  success = 'billing/REDEEM_LTD_CODE/SUCCESS',
  failure = 'billing/REDEEM_LTD_CODE/FAILURE',
  cancel = 'billing/REDEEM_LTD_CODE/CANCEL',
}

export enum TemporaryChangePlanActionTypes {
  request = 'billing/TEMPORARY_CHANGE_PLAN/REQUEST',
  success = 'billing/TEMPORARY_CHANGE_PLAN/SUCCESS',
  failure = 'billing/TEMPORARY_CHANGE_PLAN/FAILURE',
  cancel = 'billing/TEMPORARY_CHANGE_PLAN/CANCEL',
}
