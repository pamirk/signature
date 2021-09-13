import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { TeamMember } from 'Interfaces/Team';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((teamMembersIds: TeamMember['id'][]) =>
    $actions.team.deleteTeamMembers(dispatch, { teamMembersIds }),
  );
};
