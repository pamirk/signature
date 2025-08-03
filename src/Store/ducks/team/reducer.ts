import { createReducer } from 'typesafe-actions';
import { omit } from 'lodash';
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
    const newState = omit(state, action.payload.teamMembersIds);

    return newState;
  })
  .handleAction([upgradeToAdmin.success, downgradeToUser.success], (state, action) => ({
    ...state,
    [action.payload.id]: { ...state[action.payload.id], ...action.payload },
  }));
