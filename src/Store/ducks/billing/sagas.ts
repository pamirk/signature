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
} from 'Interfaces/Billing';
import { NormalizedEntity } from 'Interfaces/Common';
import {
  getCard,
  updateCard,
  getInvoices,
  changePLan,
  createCard,
  getSubscriptionData,
  getPlans,
  upgradeAppSumo,
  getApiSubscription,
  removeApiPlan,
  changeApiPlan,
} from './actionCreators';
import { User } from 'Interfaces/User';

function* handleGetCard({ meta }: ReturnType<typeof getCard.request>) {
  const cancelToken = Axios.CancelToken.source();

  try {
    const card: Card = yield call(BillingApiService.getCreditCard, {
      cancelToken: cancelToken.token,
    });

    yield put(getCard.success(card, meta));
  } catch (error:any) {
    yield put(getCard.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getCard.cancel(undefined, meta));
      cancelToken.cancel();
    }
  }
}

function* handleUpdateCard({ payload, meta }: ReturnType<typeof updateCard.request>) {
  const { values } = payload;

  try {
    const card: Card = yield call(BillingApiService.updateCard, values);

    yield put(updateCard.success(card, { ...meta, isLeading: true }));
  } catch (error:any) {
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
  } catch (error:any) {
    yield put(upgradeAppSumo.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(upgradeAppSumo.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleCreateCard({ payload, meta }: ReturnType<typeof createCard.request>) {
  const { values } = payload;

  try {
    const card: Card = yield call(BillingApiService.createCard, values);

    yield put(createCard.success(card, { ...meta, isLeading: true }));
  } catch (error:any) {
    yield put(createCard.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(createCard.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleRemoveApiPlan({ meta }: ReturnType<typeof removeApiPlan.request>) {
  try {
    const apiSubscription: ApiSubscription = yield call(BillingApiService.removeApiPlan);

    yield put(removeApiPlan.success(apiSubscription, { ...meta, isLeading: true }));
  } catch (error:any) {
    yield put(removeApiPlan.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(removeApiPlan.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

function* handleGetInvoices({ payload, meta }: ReturnType<typeof getInvoices.request>) {
  try {
    const invoices: Invoice[] = yield call(BillingApiService.getInvoices, payload);
    const normalizedInvoices: NormalizedEntity<Invoice> = lodash.keyBy(invoices, 'id');

    yield put(getInvoices.success(normalizedInvoices, { ...meta, isLeading: true }));
  } catch (error:any) {
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
  } catch (error:any) {
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
  } catch (error:any) {
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
  } catch (error:any) {
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
  } catch (error:any) {
    yield put(changePLan.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(changePLan.cancel(undefined, { ...meta, isLeading: true }));
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
  } catch (error:any) {
    yield put(changeApiPlan.failure(error, { ...meta, isLeading: true }));
  } finally {
    if (yield cancelled()) {
      yield put(changeApiPlan.cancel(undefined, { ...meta, isLeading: true }));
    }
  }
}

export default [
  takeLatest(getCard.request, handleGetCard),
  takeLatest(getSubscriptionData.request, handleSubscriptionDataGet),
  takeLatest(getApiSubscription.request, handleApiSubscriptionGet),
  takeLeading(updateCard.request, handleUpdateCard),
  takeLeading(upgradeAppSumo.request, handleAppSumoUpgrade),
  takeLeading(createCard.request, handleCreateCard),
  takeLeading(getInvoices.request, handleGetInvoices),
  takeLeading(getPlans.request, handlePlansGet),
  takeLeading(changePLan.request, handleChangePlan),
  takeLeading(changeApiPlan.request, handleChangeApiPlan),
  takeLeading(removeApiPlan.request, handleRemoveApiPlan),
];
