import { useAsyncAction } from 'Hooks/Common';
import { SignUpWithConfrimCode } from 'Interfaces/Auth';
import { useDispatch } from 'react-redux';
import { $actions } from 'Store';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: SignUpWithConfrimCode) =>
    $actions.user.signUpWithConfirmCode(dispatch, values),
  );
};
