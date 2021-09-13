import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { useAsyncAction } from 'Hooks/Common';
import { ProfileInfoPayload } from 'Interfaces/Profile';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction(async (payload: ProfileInfoPayload) =>
    $actions.user.updateProfileInfo(dispatch, payload),
  );
};
