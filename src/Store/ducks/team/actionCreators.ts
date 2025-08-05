import { createAsyncAction, createAction } from 'typesafe-actions';
import { PromisifiedActionMeta, ActionError } from 'Interfaces/ActionCreators';
import { promisifyAsyncAction } from 'Utils/functions';
import {
  InviteAcceptInitType,
  InviteAcceptFinishType,
  TeamMembersGetTypes,
  TeamMembersAddActionTypes,
  TeamMembersDeleteTypes,
  InviteAcceptActionTypes,
  UpgradeTeamMemberToAdminActionTypes,
  DowngradeTeamMemberToUserActionTypes,
} from './actionTypes';
import {
  TeamMembersData,
  TeamMembersAddPayload,
  DeleteTeamMembersPayload,
  TeamIdPayload,
  TeamMembersGetPayload,
} from 'Interfaces/Team';
import { TokenPayload, UserIdPayload, User } from 'Interfaces/User';

export const initInviteAccepting = createAction(
  InviteAcceptInitType,
  (payload: TokenPayload) => payload,
)();

export const finishInviteAccepting = createAction(InviteAcceptFinishType)();

export const getTeamMembers = createAsyncAction(
  TeamMembersGetTypes.request,
  TeamMembersGetTypes.success,
  TeamMembersGetTypes.failure,
  TeamMembersGetTypes.cancel,
)<
  [TeamMembersGetPayload, PromisifiedActionMeta],
  [TeamMembersData, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $getTeamMembers = promisifyAsyncAction(getTeamMembers);

export const deleteTeamMembers = createAsyncAction(
  TeamMembersDeleteTypes.request,
  TeamMembersDeleteTypes.success,
  TeamMembersDeleteTypes.failure,
  TeamMembersDeleteTypes.cancel,
)<
  [DeleteTeamMembersPayload, PromisifiedActionMeta],
  [DeleteTeamMembersPayload, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $deleteTeamMembers = promisifyAsyncAction(deleteTeamMembers);

export const addTeamMembers = createAsyncAction(
  TeamMembersAddActionTypes.request,
  TeamMembersAddActionTypes.success,
  TeamMembersAddActionTypes.failure,
  TeamMembersAddActionTypes.cancel,
)<
  [TeamMembersAddPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $addTeamMembers = promisifyAsyncAction(addTeamMembers);

export const acceptInvite = createAsyncAction(
  InviteAcceptActionTypes.request,
  InviteAcceptActionTypes.success,
  InviteAcceptActionTypes.failure,
  InviteAcceptActionTypes.cancel,
)<
  [TeamIdPayload, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $acceptInvite = promisifyAsyncAction(acceptInvite);

export const upgradeToAdmin = createAsyncAction(
  UpgradeTeamMemberToAdminActionTypes.request,
  UpgradeTeamMemberToAdminActionTypes.success,
  UpgradeTeamMemberToAdminActionTypes.failure,
  UpgradeTeamMemberToAdminActionTypes.cancel,
)<
  [UserIdPayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $upgradeToAdmin = promisifyAsyncAction(upgradeToAdmin);

export const downgradeToUser = createAsyncAction(
  DowngradeTeamMemberToUserActionTypes.request,
  DowngradeTeamMemberToUserActionTypes.success,
  DowngradeTeamMemberToUserActionTypes.failure,
  DowngradeTeamMemberToUserActionTypes.cancel,
)<
  [UserIdPayload, PromisifiedActionMeta],
  [User, PromisifiedActionMeta],
  [ActionError, PromisifiedActionMeta],
  [undefined, PromisifiedActionMeta]
>();

export const $downgradeToUser = promisifyAsyncAction(downgradeToUser);
