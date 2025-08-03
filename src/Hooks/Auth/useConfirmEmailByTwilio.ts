import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { TwillioEmailConfirmData } from 'Interfaces/Auth';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: TwillioEmailConfirmData) =>
    $actions.user.confirmEmailByTwilio(dispatch, values),
  );
};
