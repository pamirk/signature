import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { ApiKeysGetPayload } from 'Interfaces/ApiKey';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: ApiKeysGetPayload) =>
    $actions.apiKey.getApiKeys(dispatch, payload),
  );
};
