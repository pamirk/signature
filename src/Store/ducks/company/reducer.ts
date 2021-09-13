import { createReducer } from 'typesafe-actions';
import { redirectToBilling } from './actionCreators';

interface CompanyReducer {
  isRedirect: boolean;
}

export default createReducer({ isRedirect: false } as CompanyReducer).handleAction(
  [redirectToBilling],
  (state, action) => ({
    ...state,
    isRedirect: action.payload,
  }),
);
