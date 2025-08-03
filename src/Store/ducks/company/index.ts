import { $getCompanyInfo, getCompanyInfo, redirectToBilling } from './actionCreators';

import reducer from './reducer';
import sagas from './sagas';

export default {
  reducer,
  sagas,
  actions: {
    redirectToBilling,
    getCompanyInfo,
  },
};

export const $actions = {
  getCompanyInfo: $getCompanyInfo,
};
