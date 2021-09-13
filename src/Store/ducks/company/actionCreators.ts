import { createAction } from 'typesafe-actions';
import { redirectToBillingType } from './actionTypes';

export const redirectToBilling = createAction(redirectToBillingType)<boolean>();
