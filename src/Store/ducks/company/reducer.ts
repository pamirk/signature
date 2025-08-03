import { createReducer } from 'typesafe-actions';
import { getCompanyInfo, redirectToBilling } from './actionCreators';
import { Company } from 'Interfaces/User';

interface CompanyReducer extends Company {
  isRedirect: boolean;
}

export default createReducer({
  isRedirect: false,
  signatureTypesPreferences: {},
  signerAccessCodesPreferences: {},
} as CompanyReducer)
  .handleAction([redirectToBilling], (state, action) => ({
    ...state,
    isRedirect: action.payload,
  }))
  .handleAction([getCompanyInfo.success], (state, action) => ({
    ...state,
    ...action.payload,
  }));
