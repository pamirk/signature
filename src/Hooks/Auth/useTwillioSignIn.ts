import { useDispatch } from 'react-redux';
import { TwillioAuthData } from 'Interfaces/Auth';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: TwillioAuthData) =>
    $actions.user.signInTwillio(dispatch, values),
  );
};
