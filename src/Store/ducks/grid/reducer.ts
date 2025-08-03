import { createReducer } from 'typesafe-actions';
import { NormalizedEntity } from 'Interfaces/Common';

import { getGrid, updateGrid, getGridForSignatureRequests } from './actionCreators';
import { GridItem } from 'Interfaces/Grid';
import { toggleEmailNotification } from '../document/actionCreators';

export default createReducer({} as NormalizedEntity<GridItem>)
  .handleAction([updateGrid.success], (state, action) => ({
    ...state,
    [action.payload.id]: action.payload,
  }))
  .handleAction([toggleEmailNotification.success], (state, action) => ({
    ...state,
    [action.payload.entityId]: {
      ...state[action.payload.entityId],
      documents: {
        ...state[action.payload.entityId].documents!,
        disableReminders: action.payload.documents!.disableReminders,
      },
    },
  }))
  .handleAction(
    [getGrid.success, getGridForSignatureRequests.success],
    (state, action) => ({
      ...action.payload.grid,
    }),
  );
