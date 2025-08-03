import Api from './Api';
import { AxiosRequestConfig } from 'axios';
import { TeamMember, TeamMembersAddPayload, TeamIdPayload } from 'Interfaces/Team';
import { TokenizedPayload, UserIdPayload, User } from 'Interfaces/User';

class TeamApi extends Api {
  getTeamMembers = (params: AxiosRequestConfig['params'], config?: AxiosRequestConfig) =>
    this.request.get()('teams/members', { params, ...config });

  addTeamMembers = (values: TeamMembersAddPayload) =>
    this.request.post()<TeamMember>('add-teammates', values);

  deleteTeamMembers = (teamMemberIds: TeamMember['id'][]) => {
    return this.request.delete()(`remove-teammates`, {
      data: { ids: teamMemberIds },
    });
  };

  acceptInvite = ({ token, payload }: TokenizedPayload<TeamIdPayload>) => {
    return this.request.post(token)(`add-teammates/${payload.teamId}/accept_invite`);
  };

  upgradeToAdmin = (payload: UserIdPayload) => {
    return this.request.post()<User>(`teams/${payload.userId}/upgrade_to_admin`);
  };

  downgradeToUser = (payload: UserIdPayload) => {
    return this.request.post()<User>(`teams/${payload.userId}/downgrade_to_user`);
  };
}

export default new TeamApi();
