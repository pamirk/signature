import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { GridGetForSignatureRequestsPayload } from 'Interfaces/Grid';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: GridGetForSignatureRequestsPayload) =>
    $actions.grid.getGridForSignatureRequests(dispatch, payload),
  );
};
