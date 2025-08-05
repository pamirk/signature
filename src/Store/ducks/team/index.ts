import sagas from './sagas';
import {
  $addTeamMembers,
  $deleteTeamMembers,
  $getTeamMembers,
  addTeamMembers,
  deleteTeamMembers,
  acceptInvite,
  $acceptInvite,
  finishInviteAccepting,
  initInviteAccepting,
  getTeamMembers,
  upgradeToAdmin,
  $upgradeToAdmin,
  downgradeToUser,
  $downgradeToUser,
} from './actionCreators';
import reducer from './reducer';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  sagas,
  reducer,
  actions: {
    finishInviteAccepting,
    acceptInvite,
    initInviteAccepting,
    addTeamMembers,
    deleteTeamMembers,
    getTeamMembers,
    upgradeToAdmin,
    downgradeToUser,
  },
};

export const $actions = {
  addTeamMembers: $addTeamMembers,
  acceptInvite: $acceptInvite,
  deleteTeamMembers: $deleteTeamMembers,
  getTeamMembers: $getTeamMembers,
  upgradeToAdmin: $upgradeToAdmin,
  downgradeToUser: $downgradeToUser,
};
