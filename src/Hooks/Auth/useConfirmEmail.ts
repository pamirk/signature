import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { PasswordChangeData } from 'Interfaces/Auth';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction(() => $actions.user.confirmEmail(dispatch));
};
