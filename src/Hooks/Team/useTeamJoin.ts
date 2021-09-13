import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { TeamIdPayload } from 'Interfaces/Team';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: TeamIdPayload) =>
    $actions.team.acceptInvite(dispatch, payload),
  );
};
