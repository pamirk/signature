import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { DocumentBulkSendValues } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: DocumentBulkSendValues) =>
    $actions.document.sendDocumentBulk(dispatch, payload),
  );
};
