import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { useAsyncAction } from 'Hooks/Common';
import { UpdateEmailPayload } from 'Interfaces/Profile';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction(async (payload: UpdateEmailPayload) =>
    $actions.user.updateEmail(dispatch, payload),
  );
};
