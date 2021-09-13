import { useDispatch } from 'react-redux';
import { AppSumoPayload } from 'Interfaces/Auth';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: AppSumoPayload) =>
    $actions.user.signInAppSumoUser(dispatch, payload),
  );
};
