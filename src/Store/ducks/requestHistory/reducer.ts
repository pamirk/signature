import { createReducer } from 'typesafe-actions';
import { NormalizedEntity } from 'Interfaces/Common';
import { getRequestHistory } from './actionCreators';
import { RequestHistoryItem } from 'Interfaces/RequestsHistory';

export default createReducer({} as NormalizedEntity<RequestHistoryItem>).handleAction(
  getRequestHistory.success,
  (state, action) => ({
    ...action.payload.requestHistory,
  }),
);
