export const InviteAcceptInitType = 'team/ACCEPT_INVITE_INIT';

export const InviteAcceptFinishType = 'team/ACCEPT_INVITE_FINISH';

export enum TeamMembersGetTypes {
  request = 'team/GET_TEAM_MEMBERS/REQUEST',
  success = 'team/GET_TEAM_MEMBERS/SUCCESS',
  failure = 'team/GET_TEAM_MEMBERS/FAILURE',
  cancel = 'team/GET_TEAM_MEMBERS/CANCEL',
}

export enum TeamMembersDeleteTypes {
  request = 'team/DELETE_TEAM_MEMBERS/REQUEST',
  success = 'team/DELETE_TEAM_MEMBERS/SUCCESS',
  failure = 'team/DELETE_TEAM_MEMBERS/FAILURE',
  cancel = 'team/DELETE_TEAM_MEMBERS/CANCEL',
}

export enum TeamMembersAddActionTypes {
  request = 'team/TEAM_MEMBERS_ADD/REQUEST',
  success = 'team/TEAM_MEMBERS_ADD/SUCCESS',
  failure = 'team/TEAM_MEMBERS_ADD/FAILURE',
  cancel = 'team/TEAM_MEMBERS_ADD/CANCEL',
}

export enum InviteAcceptActionTypes {
  request = 'team/ACCEPT_INVITE/REQUEST',
  success = 'team/ACCEPT_INVITE/SUCCESS',
  failure = 'team/ACCEPT_INVITE/FAILURE',
  cancel = 'team/ACCEPT_INVITE/CANCEL',
}

export enum UpgradeTeamMemberToAdminActionTypes {
  request = 'team/UPGRADE_TO_ADMIN/REQUEST',
  success = 'team/UPGRADE_TO_ADMIN/SUCCESS',
  failure = 'team/UPGRADE_TO_ADMIN/FAILURE',
  cancel = 'team/UPGRADE_TO_ADMIN/CANCEL',
}

export enum DowngradeTeamMemberToUserActionTypes {
  request = 'team/DOWNGRADE_TO_USER/REQUEST',
  success = 'team/DOWNGRADE_TO_USER/SUCCESS',
  failure = 'team/DOWNGRADE_TO_USER/FAILURE',
  cancel = 'team/DOWNGRADE_TO_USER/CANCEL',
}
