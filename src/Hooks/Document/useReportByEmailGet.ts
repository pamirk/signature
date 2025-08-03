import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { useAsyncAction } from 'Hooks/Common';
import { GetReportByEmailPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction(async (payload: GetReportByEmailPayload) =>
    $actions.document.getReportByEmail(dispatch, payload),
  );
};
