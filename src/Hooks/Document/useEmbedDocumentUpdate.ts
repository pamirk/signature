import { useDispatch } from 'react-redux';
import { DocumentUpdatePayload } from 'Interfaces/Document';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: DocumentUpdatePayload) =>
    $actions.document.updateEmbedDocument(dispatch, payload),
  );
};
