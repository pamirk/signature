import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { SignUpData } from 'Interfaces/Auth';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: SignUpData) =>
    $actions.user.signUpFromTemporary(dispatch, payload),
  );
};
