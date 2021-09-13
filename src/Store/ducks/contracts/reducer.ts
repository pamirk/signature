import { createReducer } from 'typesafe-actions';

import { getFormRequestContracts } from './actionCreators';
import { Contract } from 'Interfaces/Contract';

export default createReducer({} as Contract).handleAction(
  getFormRequestContracts.success,
  (state, action) => ({
    ...action.payload.contracts,
  }),
);
