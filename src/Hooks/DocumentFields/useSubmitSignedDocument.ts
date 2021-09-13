import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { useAsyncAction } from 'Hooks/Common';
import { DocumentSubmitPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction(async (payload: DocumentSubmitPayload) =>
    $actions.documentSign.submitSignedDocument(dispatch, payload),
  );
};
