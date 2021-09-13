import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { SignedUrlPayload } from 'Interfaces/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: SignedUrlPayload) =>
    $actions.user.getSignedGetDownloadUrl(dispatch, payload),
  );
};
