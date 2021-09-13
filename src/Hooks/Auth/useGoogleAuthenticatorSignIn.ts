import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { CodePayload } from 'Interfaces/Profile';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: CodePayload) =>
    $actions.user.signInGoogleAuthenticator(dispatch, values),
  );
};
