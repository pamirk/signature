import { useDispatch } from 'react-redux';
import { SignUpData } from 'Interfaces/Auth';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: SignUpData) =>
    $actions.user.ltdSignUp(dispatch, { values }),
  );
};
