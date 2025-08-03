import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { BulkSignedUrlPayload } from 'Interfaces/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: BulkSignedUrlPayload) =>
    $actions.user.getEmbedSignedUrlBulk(dispatch, payload),
  );
};
