import { put, call, takeLeading, cancelled, takeLatest } from 'redux-saga/effects';
import lodash from 'lodash';
import Axios from 'axios';
import BillingApiService from 'Services/Api/Billing';
import {
  Card,
  PlanDetails,
  Invoice,
  SubscriptionData,
  ApiSubscription,
  GetLatestInvoicePayload,
  CheckoutSessionUrl,
  GetUpcomingInvoicePayload,
  InvoiceDownloadLinkPayload,
  LtdTier,
  LtdCheckoutResponse,
  LtdCheckoutUpgradeResponse,
} from 'Interfaces/Billing';
import { NormalizedEntity } from 'Interfaces/Common';
import {
  getCard,
  updateCard,
  getInvoices,
  changePLan,
  attachCard,
  getSubscriptionData,
  getPlans,
  upgradeAppSumo,
  getApiSubscription,
  removeApiPlan,
  changeApiPlan,
  retryCharge,
  upsellPlan,
  validatePromotionCode,
  getLatestInvoice,
  creatSetupCheckoutSession,
  createSubscriptionCheckout,
  checkUpsellAllowed,
  createBillingPortal,
  getUpcomingInvoice,
  getInvoiceDownloadLink,
  getLtdUpcomingInvoice,
  changeLtdPlanDuration,
  createLtdPaymentCheckout,
  capturePaypalOrder,
  getLtdTier,
  getLtdTiers,
  upgradeLtdPaymentCheckout,
  validateLtdCode,
  redeemLtdCode,
  temporaryChangePlan,
  cancelPlan,
} from './actionCreators';
import { User } from 'Interfaces/User';

function* handleGetCard({ meta }: ReturnType<typeof getCard.request>) {
  const cancelToken = Axios.CancelToken.source();

  try {
    const card: Card = yield call(BillingApiService.getCreditCard, {
      cancelToken: cancelToken.token,
    });

    yield put(getCard.success(card, meta));
  } catch (error) {
    yield put(getCard.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getCard.cancel(undefined, meta));
      cancelToken.cancel();
    }
  }
}

function* handleUpdateCard({ payload, meta }: ReturnType<typeof updateCard.request>) {
  const { token } = payload;

  try {
    const card: Card = yield call(BillingApiService.updateCard, token);

    yield put(updateCard.success(card, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(updateCard.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(updateCard.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleAppSumoUpgrade({
  payload,
  meta,
}: ReturnType<typeof upgradeAppSumo.request>) {
  try {
    const user: User = yield call(BillingApiService.upgradeAppSumo, payload);

    yield put(upgradeAppSumo.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(upgradeAppSumo.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(upgradeAppSumo.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleAttachCard({ payload, meta }: ReturnType<typeof attachCard.request>) {
  const { token } = payload;

  try {
    const card: Card = yield call(BillingApiService.attachCard, token);

    yield put(attachCard.success(card, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(attachCard.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(attachCard.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleRemoveApiPlan({ meta }: ReturnType<typeof removeApiPlan.request>) {
  try {
    const apiSubscription: ApiSubscription = yield call(BillingApiService.removeApiPlan);

    yield put(removeApiPlan.success(apiSubscription, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(removeApiPlan.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(removeApiPlan.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGetInvoices({ payload, meta }: ReturnType<typeof getInvoices.request>) {
  try {
    const { items, totalItems, totalPages, itemCount } = yield call(
      BillingApiService.getInvoices,
      payload,
    );
    const normalizedInvoices: NormalizedEntity<Invoice> = lodash.keyBy(items, 'id');

    yield put(
      getInvoices.success(
        {
          invoices: normalizedInvoices,
          paginationData: { totalItems, pageCount: totalPages, itemsCount: itemCount },
        },
        { ...meta, isLeading: true },
      ),
    );
  } catch (error) {
    yield put(getInvoices.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(getInvoices.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handlePlansGet({ meta }: ReturnType<typeof getPlans.request>) {
  try {
    const plans: PlanDetails[] = yield call(BillingApiService.getPlans);

    yield put(getPlans.success(plans, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getPlans.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(getPlans.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleSubscriptionDataGet({
  meta,
}: ReturnType<typeof getSubscriptionData.request>) {
  try {
    const subscriptionData: SubscriptionData = yield call(
      BillingApiService.getSubscriptionData,
    );

    yield put(
      getSubscriptionData.success(subscriptionData, { ...meta, isLeading: true }),
    );
  } catch (error) {
    yield put(getSubscriptionData.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(getSubscriptionData.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleApiSubscriptionGet({
  meta,
}: ReturnType<typeof getApiSubscription.request>) {
  try {
    const subscriptionData: ApiSubscription = yield call(
      BillingApiService.getApiSubscription,
    );

    yield put(getApiSubscription.success(subscriptionData, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getApiSubscription.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(getApiSubscription.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleChangePlan({ payload, meta }: ReturnType<typeof changePLan.request>) {
  try {
    const user: User = yield call(BillingApiService.changePlan, payload);

    yield put(changePLan.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(changePLan.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(changePLan.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleCancelPlan({ payload, meta }: ReturnType<typeof cancelPlan.request>) {
  try {
    const user: User = yield call(BillingApiService.cancelPlan, payload);

    yield put(cancelPlan.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(cancelPlan.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(cancelPlan.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleChangeApiPlan({
  payload,
  meta,
}: ReturnType<typeof changeApiPlan.request>) {
  try {
    const apiSubscription: ApiSubscription = yield call(
      BillingApiService.changeApiPlan,
      payload,
    );

    yield put(changeApiPlan.success(apiSubscription, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(changeApiPlan.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(changeApiPlan.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleChargeRetry({ meta }: ReturnType<typeof retryCharge.request>) {
  try {
    const response: SubscriptionData = yield call(BillingApiService.retryCharge);

    yield put(retryCharge.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(retryCharge.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(retryCharge.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleUpsellPlan({ payload, meta }: ReturnType<typeof upsellPlan.request>) {
  try {
    const {
      updatedUser,
    }: { updatedUser: User; subscription: SubscriptionData } = yield call(
      BillingApiService.upsellPlan,
    );

    yield put(upsellPlan.success(updatedUser, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(upsellPlan.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(upsellPlan.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleValidatePromotionCode({
  payload,
  meta,
}: ReturnType<typeof validatePromotionCode.request>) {
  try {
    const response = yield call(
      payload.authorized
        ? BillingApiService.validatePromotionCode
        : BillingApiService.validatePromotionCodeUnauthorized,
      payload,
    );

    yield put(validatePromotionCode.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(validatePromotionCode.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(validatePromotionCode.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGetLatestInvoice({ meta }: ReturnType<typeof getLatestInvoice.request>) {
  try {
    const response: GetLatestInvoicePayload = yield call(
      BillingApiService.getLatestInvoice,
    );

    yield put(getLatestInvoice.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getLatestInvoice.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(getLatestInvoice.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleCreateCheckout({
  payload,
  meta,
}: ReturnType<typeof creatSetupCheckoutSession.request>) {
  try {
    const card: CheckoutSessionUrl = yield call(BillingApiService.createSetupCheckout);

    yield put(creatSetupCheckoutSession.success(card, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(creatSetupCheckoutSession.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(
        creatSetupCheckoutSession.cancel(undefined, { ...meta, isLeading: true }),
      );
    }
  }
}

function* handleCreateSubscriptionCheckout({
  payload,
  meta,
}: ReturnType<typeof createSubscriptionCheckout.request>) {
  try {
    const card: CheckoutSessionUrl = yield call(
      BillingApiService.createSubscriptionCheckout,
      payload,
    );

    yield put(createSubscriptionCheckout.success(card, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(createSubscriptionCheckout.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(
        createSubscriptionCheckout.cancel(undefined, { ...meta, isLeading: true }),
      );
    }
  }
}

function* handleCheckUpsellAllowed({
  payload,
  meta,
}: ReturnType<typeof checkUpsellAllowed.request>) {
  try {
    const response: string = yield call(BillingApiService.checkUpsellAllowed);
    yield put(checkUpsellAllowed.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(checkUpsellAllowed.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(checkUpsellAllowed.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleCreateBillingPortal({
  payload,
  meta,
}: ReturnType<typeof createBillingPortal.request>) {
  try {
    const response: CheckoutSessionUrl = yield call(
      BillingApiService.createBillingPortal,
    );
    yield put(createBillingPortal.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(createBillingPortal.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(createBillingPortal.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGetUpcomingInvoice({
  payload,
  meta,
}: ReturnType<typeof getUpcomingInvoice.request>) {
  try {
    const response: GetUpcomingInvoicePayload = yield call(
      BillingApiService.getUpcomingInvoice,
      payload,
    );
    yield put(getUpcomingInvoice.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getUpcomingInvoice.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(getUpcomingInvoice.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGetLtdUpcomingInvoice({
  payload,
  meta,
}: ReturnType<typeof getLtdUpcomingInvoice.request>) {
  try {
    const response: GetUpcomingInvoicePayload = yield call(
      BillingApiService.getLtdUpcomingInvoice,
      payload,
    );
    yield put(getLtdUpcomingInvoice.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getLtdUpcomingInvoice.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(getLtdUpcomingInvoice.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGetInvoiceDownloadLink({
  payload,
  meta,
}: ReturnType<typeof getInvoiceDownloadLink.request>) {
  try {
    const response: InvoiceDownloadLinkPayload = yield call(
      BillingApiService.getInvoiceDownloadLink,
      payload,
    );
    yield put(getInvoiceDownloadLink.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getInvoiceDownloadLink.failure(error, { ...meta, isLeading: true }));
  }
}

function* handleChangeLtdPlanDuration({
  payload,
  meta,
}: ReturnType<typeof changeLtdPlanDuration.request>) {
  try {
    const user: User = yield call(BillingApiService.changeLtdPlanDuration, payload);

    yield put(changeLtdPlanDuration.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(changeLtdPlanDuration.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(changeLtdPlanDuration.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleCreateLtdPaymentCheckout({
  payload,
  meta,
}: ReturnType<typeof createLtdPaymentCheckout.request>) {
  try {
    const response: LtdCheckoutResponse = yield call(
      BillingApiService.createLtdPaymentCheckout,
      payload,
    );

    yield put(createLtdPaymentCheckout.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(createLtdPaymentCheckout.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(createLtdPaymentCheckout.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleUpgradeLtdPaymentCheckout({
  payload,
  meta,
}: ReturnType<typeof upgradeLtdPaymentCheckout.request>) {
  try {
    const response: LtdCheckoutUpgradeResponse = yield call(
      BillingApiService.upgradeLtdPaymentCheckout,
      payload,
    );

    yield put(upgradeLtdPaymentCheckout.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(upgradeLtdPaymentCheckout.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(
        upgradeLtdPaymentCheckout.cancel(undefined, { ...meta, isLeading: true }),
      );
    }
  }
}

function* handleCapturePaypalOrder({
  payload,
  meta,
}: ReturnType<typeof capturePaypalOrder.request>) {
  try {
    yield call(BillingApiService.capturePaypalOrder, payload);

    yield put(capturePaypalOrder.success(undefined, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(capturePaypalOrder.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(capturePaypalOrder.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGetLtdTier({ payload, meta }: ReturnType<typeof getLtdTier.request>) {
  try {
    const response: LtdTier = yield call(BillingApiService.getLtdTier, payload);

    yield put(getLtdTier.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getLtdTier.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(getLtdTier.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGetLtdTiers({ meta }: ReturnType<typeof getLtdTiers.request>) {
  try {
    const response: LtdTier[] = yield call(BillingApiService.getLtdTiers);

    yield put(getLtdTiers.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(getLtdTiers.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(getLtdTiers.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleValidateLtdCode({
  payload,
  meta,
}: ReturnType<typeof validateLtdCode.request>) {
  try {
    const response: LtdTier = yield call(BillingApiService.validateLtdCode, payload);

    yield put(validateLtdCode.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(validateLtdCode.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(validateLtdCode.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleRedeemLtdCode({
  payload,
  meta,
}: ReturnType<typeof redeemLtdCode.request>) {
  try {
    const response: User = yield call(BillingApiService.redeemLtdCode, payload);

    yield put(redeemLtdCode.success(response, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(redeemLtdCode.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(redeemLtdCode.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleTemporaryChangePlan({
  payload,
  meta,
}: ReturnType<typeof temporaryChangePlan.request>) {
  try {
    const user: User = yield call(BillingApiService.temporaryChangePlan, payload);

    yield put(temporaryChangePlan.success(user, { ...meta, isLeading: true }));
  } catch (error) {
    yield put(temporaryChangePlan.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(temporaryChangePlan.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

export default [
  takeLatest(getCard.request, handleGetCard),
  takeLatest(getSubscriptionData.request, handleSubscriptionDataGet),
  takeLatest(getApiSubscription.request, handleApiSubscriptionGet),
  takeLeading(updateCard.request, handleUpdateCard),
  takeLeading(upgradeAppSumo.request, handleAppSumoUpgrade),
  takeLeading(attachCard.request, handleAttachCard),
  takeLeading(getInvoices.request, handleGetInvoices),
  takeLeading(getPlans.request, handlePlansGet),
  takeLeading(changePLan.request, handleChangePlan),
  takeLeading(cancelPlan.request, handleCancelPlan),
  takeLeading(changeApiPlan.request, handleChangeApiPlan),
  takeLeading(removeApiPlan.request, handleRemoveApiPlan),
  takeLeading(retryCharge.request, handleChargeRetry),
  takeLeading(upsellPlan.request, handleUpsellPlan),
  takeLeading(validatePromotionCode.request, handleValidatePromotionCode),
  takeLeading(getLatestInvoice.request, handleGetLatestInvoice),
  takeLeading(creatSetupCheckoutSession.request, handleCreateCheckout),
  takeLeading(createSubscriptionCheckout.request, handleCreateSubscriptionCheckout),
  takeLeading(checkUpsellAllowed.request, handleCheckUpsellAllowed),
  takeLeading(createBillingPortal.request, handleCreateBillingPortal),
  takeLeading(getUpcomingInvoice.request, handleGetUpcomingInvoice),
  takeLeading(getLtdUpcomingInvoice.request, handleGetLtdUpcomingInvoice),
  takeLeading(getInvoiceDownloadLink.request, handleGetInvoiceDownloadLink),
  takeLeading(changeLtdPlanDuration.request, handleChangeLtdPlanDuration),
  takeLeading(createLtdPaymentCheckout.request, handleCreateLtdPaymentCheckout),
  takeLeading(upgradeLtdPaymentCheckout.request, handleUpgradeLtdPaymentCheckout),
  takeLeading(capturePaypalOrder.request, handleCapturePaypalOrder),
  takeLeading(getLtdTier.request, handleGetLtdTier),
  takeLeading(getLtdTiers.request, handleGetLtdTiers),
  takeLeading(validateLtdCode.request, handleValidateLtdCode),
  takeLeading(redeemLtdCode.request, handleRedeemLtdCode),
  takeLeading(temporaryChangePlan.request, handleTemporaryChangePlan),
];
