import { useAsyncAction } from 'Hooks/Common';
import { FormRequestsGetPayload } from 'Interfaces/Document';
import { $actions } from 'Store/ducks';
import { useDispatch } from 'react-redux';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: FormRequestsGetPayload) =>
    $actions.document.getFormRequests(dispatch, payload),
  );
};
