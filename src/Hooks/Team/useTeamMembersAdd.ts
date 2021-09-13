import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { TeamMembersAddPayload } from 'Interfaces/Team';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: TeamMembersAddPayload) =>
    $actions.team.addTeamMembers(dispatch, values),
  );
};
