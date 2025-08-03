import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { useAsyncAction } from 'Hooks/Common';
import { SignerDocumentIdPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction(async (payload: SignerDocumentIdPayload) =>
    $actions.documentSign.declineSigningRequest(dispatch, payload),
  );
};
