import { createReducer } from 'typesafe-actions';
import * as _ from 'lodash';
import { NormalizedEntity } from 'Interfaces/Common';
import { TeamMember } from 'Interfaces/Team';
import {
  getTeamMembers,
  upgradeToAdmin,
  deleteTeamMembers,
  downgradeToUser,
} from './actionCreators';

export default createReducer({} as NormalizedEntity<TeamMember>)
  .handleAction(getTeamMembers.success, (state, action) => ({
    ...action.payload.teamMembers,
  }))
  .handleAction(deleteTeamMembers.success, (state, action) => {
    const newState = _.omit(state, action.payload.teamMembersIds);

    return newState;
  })
  .handleAction([upgradeToAdmin.success, downgradeToUser.success], (state, action) => ({
    ...state,
    [action.payload.id]: { ...state[action.payload.id], ...action.payload },
  }));
