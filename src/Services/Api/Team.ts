import Api from './Api';
import { AxiosRequestConfig } from 'axios';
import { TeamMember, TeamMembersAddPayload, TeamIdPayload } from 'Interfaces/Team';
import { TokenizedPayload, UserIdPayload, User } from 'Interfaces/User';

class TeamApi extends Api {
  getTeamMembers:any = (params: AxiosRequestConfig['params'], config?: AxiosRequestConfig) =>
    this.request.get()('teams/members', { params, ...config });

  addTeamMembers:any = (values: TeamMembersAddPayload) =>
    this.request.post()<TeamMember>('teams/members', values);

  deleteTeamMembers:any = (teamMemberIds: TeamMember['id'][]) => {
    return this.request.delete()(`teams/members`, {
      data: { ids: teamMemberIds },
    });
  };

  acceptInvite:any = ({ token, payload }: TokenizedPayload<TeamIdPayload>) => {
    return this.request.post(token)(`teams/${payload.teamId}/accept_invite`);
  };

  upgradeToAdmin:any = (payload: UserIdPayload) => {
    return this.request.post()<User>(`teams/${payload.userId}/upgrade_to_admin`);
  };

  downgradeToUser:any = (payload: UserIdPayload) => {
    return this.request.post()<User>(`teams/${payload.userId}/downgrade_to_user`);
  };
}

export default new TeamApi();
