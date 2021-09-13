import { useDispatch } from 'react-redux';
import { AuthData } from 'Interfaces/Auth';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: AuthData) =>
    $actions.user.signInPrimary(dispatch, { values }),
  );
};
