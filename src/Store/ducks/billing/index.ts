import sagas from './sagas';
import {
  getCard,
  $getCard,
  updateCard,
  createCard,
  $createCard,
  getSubscriptionData,
  $getSubscriptionData,
  getApiSubscription,
  $getApiSubscription,
  getPlans,
  $getPlans,
  removeApiPlan,
  $removeApiPlan,
  changePLan,
  $changePLan,
  changeApiPlan,
  $changeApiPlan,
  getInvoices,
  upgradeAppSumo,
  $upgradeAppSumo,
  $getInvoices,
  $updateCard,
} from './actionCreators';
import reducer from './reducer';

export default {
  sagas,
  reducer,
  actions: {
    getCard,
    getApiSubscription,
    getPlans,
    upgradeAppSumo,
    createCard,
    changePLan,
    changeApiPlan,
    getSubscriptionData,
    updateCard,
    removeApiPlan,
    getInvoices,
  },
};

export const $actions = {
  getInvoices: $getInvoices,
  getApiSubscription: $getApiSubscription,
  removeApiPlan: $removeApiPlan,
  getCard: $getCard,
  createCard: $createCard,
  upgradeAppSumo: $upgradeAppSumo,
  changeApiPlan: $changeApiPlan,
  getPlans: $getPlans,
  getSubscriptionData: $getSubscriptionData,
  updateCard: $updateCard,
  changePLan: $changePLan,
};
