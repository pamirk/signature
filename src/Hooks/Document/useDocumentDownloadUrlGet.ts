import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { useDispatch } from 'react-redux';
import { DocumentDownloadPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: DocumentDownloadPayload) =>
    $actions.document.getDocumentDownloadUrl(dispatch, payload),
  );
};
