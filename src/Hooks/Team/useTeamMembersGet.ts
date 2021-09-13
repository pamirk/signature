import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { TeamMembersGetPayload } from 'Interfaces/Team';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: TeamMembersGetPayload) =>
    $actions.team.getTeamMembers(dispatch, payload),
  );
};
