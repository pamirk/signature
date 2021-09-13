import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { DocumentIdPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: DocumentIdPayload) =>
    $actions.documentSign.getAvailableSignersOptions(dispatch, payload),
  );
};
