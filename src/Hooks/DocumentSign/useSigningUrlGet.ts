import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { useAsyncAction } from 'Hooks/Common';
import { SigningUrlGetPayload } from 'Interfaces/Document';

export default () => {
  const dispatch = useDispatch();

  // @ts-ignore
  return useAsyncAction((payload: SigningUrlGetPayload) => $actions.documentSign.getSigningUrl(dispatch, payload),);
};
