import { createAction, createAsyncAction } from 'typesafe-actions';
import { GetCompanyInfoActionTypes, redirectToBillingType } from './actionTypes';
import { ActionError, PromisifiedActionMeta } from 'Interfaces/ActionCreators';
import { Company } from 'Interfaces/User';
import { promisifyAsyncAction } from 'Utils/functions';

export const redirectToBilling = createAction(redirectToBillingType)<boolean>();

export const getCompanyInfo = createAsyncAction(
  GetCompanyInfoActionTypes.request,
  GetCompanyInfoActionTypes.success,
  GetCompanyInfoActionTypes.failure,
  GetCompanyInfoActionTypes.cancel,
)<
  [undefined, PromisifiedActionMeta],
  [Company, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getCompanyInfo = promisifyAsyncAction(getCompanyInfo);
