import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { DocumentDeletePayload } from 'Interfaces/Document';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: DocumentDeletePayload) =>
    $actions.document.deleteDocument(dispatch, payload),
  );
};
