import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { EmailPayload } from 'Interfaces/Auth';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: EmailPayload) =>
    $actions.user.sendConformationEmail(dispatch, payload),
  );
};
