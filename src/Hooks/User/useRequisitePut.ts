import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { FilePutPayload } from 'Services/AWS';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction(async (payload: FilePutPayload) =>
    $actions.user.putRequisite(dispatch, payload),
  );
};
