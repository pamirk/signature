import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { CompatibleSignedUrlPayload } from 'Interfaces/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: CompatibleSignedUrlPayload) =>
    $actions.user.getCompatibleSignedGetUrl(dispatch, payload),
  );
};
