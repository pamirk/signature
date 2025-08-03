import { put, call, takeLatest, cancelled, select, takeEvery } from 'redux-saga/effects';
import lodash from 'lodash';
import TeamApiService from 'Services/Api/Team';
import { NormalizedEntity } from 'Interfaces/Common';
import {
  addTeamMembers,
  getTeamMembers,
  deleteTeamMembers,
  acceptInvite,
  upgradeToAdmin,
  downgradeToUser,
} from './actionCreators';
import Axios from 'axios';
import { TeamMember } from 'Interfaces/Team';
import { selectSignToken } from 'Utils/selectors';
import { UserReducerState } from '../user/reducer';
import { User } from 'Interfaces/User';

function* handleTeamMembersGet({
  payload,
  meta,
}: ReturnType<typeof getTeamMembers.request>) {
  const cancelToken = Axios.CancelToken.source();

  try {
    const { members } = yield call(TeamApiService.getTeamMembers, payload, {
      cancelToken: cancelToken.token,
    });

    const normalizedTeamMembers: NormalizedEntity<TeamMember> = lodash.keyBy(
      members || [],
      'id',
    );

    yield put(getTeamMembers.success({ teamMembers: normalizedTeamMembers }, meta));
  } catch (error) {
    yield put(getTeamMembers.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(getTeamMembers.cancel(undefined, meta));
      cancelToken.cancel();
    }
  }
}

function* handleDeleteTeamMembers({
  payload,
  meta,
}: ReturnType<typeof deleteTeamMembers.request>) {
  const { teamMembersIds } = payload;

  try {
    yield call(TeamApiService.deleteTeamMembers, teamMembersIds);

    yield put(deleteTeamMembers.success({ teamMembersIds }, meta));
  } catch (error) {
    yield put(deleteTeamMembers.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(deleteTeamMembers.cancel(undefined, meta));
    }
  }
}

function* handleAddTeamMembers({
  payload,
  meta,
}: ReturnType<typeof addTeamMembers.request>) {
  try {
    yield call(TeamApiService.addTeamMembers, payload);
    yield put(addTeamMembers.success(undefined, meta));
  } catch (error) {
    yield put(addTeamMembers.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(addTeamMembers.cancel(undefined, meta));
    }
  }
}

function* handleInviteAccept({ payload, meta }: ReturnType<typeof acceptInvite.request>) {
  try {
    const token: UserReducerState['signToken'] = yield select(selectSignToken);

    yield call(TeamApiService.acceptInvite, { token, payload });

    yield put(acceptInvite.success(undefined, meta));
  } catch (error) {
    yield put(acceptInvite.failure(error, meta));
  } finally {
    if (yield cancelled()) {
      yield put(acceptInvite.cancel(undefined, meta));
    }
  }
}

function* handleToAdminUpgrade({
  payload,
  meta,
}: ReturnType<typeof upgradeToAdmin.request>) {
  try {
    const teamMember: User = yield call(TeamApiService.upgradeToAdmin, payload);

    yield put(upgradeToAdmin.success(teamMember, meta));
  } catch (err) {
    yield put(upgradeToAdmin.failure(err, meta));
  } finally {
    if (yield cancelled()) {
      yield put(upgradeToAdmin.cancel(undefined, meta));
    }
  }
}

function* handleToUserDonwgrade({
  payload,
  meta,
}: ReturnType<typeof downgradeToUser.request>) {
  try {
    const teamMember: User = yield call(TeamApiService.downgradeToUser, payload);

    yield put(downgradeToUser.success(teamMember, meta));
  } catch (err) {
    yield put(downgradeToUser.failure(err, meta));
  } finally {
    if (yield cancelled()) {
      yield put(downgradeToUser.cancel(undefined, meta));
    }
  }
}

export default [
  takeLatest(getTeamMembers.request, handleTeamMembersGet),
  takeLatest(addTeamMembers.request, handleAddTeamMembers),
  takeLatest(deleteTeamMembers.request, handleDeleteTeamMembers),
  takeLatest(acceptInvite.request, handleInviteAccept),
  takeEvery(upgradeToAdmin.request, handleToAdminUpgrade),
  takeEvery(downgradeToUser.request, handleToUserDonwgrade),
];
