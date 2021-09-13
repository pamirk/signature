import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { RequestHistoryGetPayload } from 'Interfaces/RequestsHistory';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: RequestHistoryGetPayload) =>
    $actions.requestHistory.getRequestHistory(dispatch, payload),
  );
};
