import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { ApiKeyCreatePayload } from 'Interfaces/ApiKey';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: ApiKeyCreatePayload) =>
    $actions.apiKey.createApiKey(dispatch, payload),
  );
};
