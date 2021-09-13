import { useDispatch } from 'react-redux';
import { DocumentUpdatePayload } from 'Interfaces/Document';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: DocumentUpdatePayload) =>
    $actions.document.updateDocument(dispatch, values),
  );
};
