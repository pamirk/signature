import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { SignerDocumentIdPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: SignerDocumentIdPayload) =>
    $actions.documentSign.sendSignatoryOpened(dispatch, payload),
  );
};
