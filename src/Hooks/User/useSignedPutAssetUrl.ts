import { useDispatch } from 'react-redux';
import { SignedUrlPayload } from 'Interfaces/Common';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: SignedUrlPayload) =>
    $actions.user.getSignedPutAssetUrl(dispatch, payload),
  );
};
