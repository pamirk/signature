import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { SignatureRequest } from 'Interfaces/SignatureRequest';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((signatureRequestIds: SignatureRequest['id'][]) =>
    $actions.signatureRequest.deleteSignatureRequests(dispatch, { signatureRequestIds }),
  );
};
