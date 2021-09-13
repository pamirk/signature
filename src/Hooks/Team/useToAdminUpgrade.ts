import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { UserIdPayload } from 'Interfaces/User';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: UserIdPayload) =>
    $actions.team.upgradeToAdmin(dispatch, payload),
  );
};
