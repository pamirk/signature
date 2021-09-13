import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { DocumentsGetPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: DocumentsGetPayload) =>
    $actions.document.getDocuments(dispatch, payload),
  );
};
