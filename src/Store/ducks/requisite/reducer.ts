import { createReducer } from 'typesafe-actions';
import { Requisite } from 'Interfaces/Requisite';
import { NormalizedEntity } from 'Interfaces/Common';
import {
  getRequisites,
  updateRequisites,
  deleteRequisite,
  createRequisites,
} from './actionCreators';

export default createReducer({} as NormalizedEntity<Requisite>)
  .handleAction([getRequisites.success], (state, action) => ({
    ...action.payload,
  }))
  .handleAction(
    [updateRequisites.success, createRequisites.success, deleteRequisite.success],
    (state, action) => ({
      ...state,
      [action.payload[0].id]: action.payload[0],
      [action.payload[1].id]: action.payload[1],
    }),
  );
