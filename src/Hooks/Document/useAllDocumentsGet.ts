import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { DocumentsAllGetPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload?: DocumentsAllGetPayload) =>
    $actions.document.getAllDocuments(dispatch, payload),
  );
};
