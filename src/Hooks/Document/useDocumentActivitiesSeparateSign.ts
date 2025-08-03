import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { useDispatch } from 'react-redux';
import { DocumentSeparateSignPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: DocumentSeparateSignPayload) =>
    $actions.document.signSeparateDocumentActivities(dispatch, payload),
  );
};
