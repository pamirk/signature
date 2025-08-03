import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import useGoogleClientIdGet from 'Hooks/Common/useGoogleClientIdGet';

export default () => {
  const dispatch = useDispatch();
  const clientId = useGoogleClientIdGet();

  return useAsyncAction(
    () => clientId && $actions.user.updateGoolgeClientId(dispatch, { clientId }),
  );
};
