import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { ApiKey } from 'Interfaces/ApiKey';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: ApiKey['id']) =>
    $actions.apiKey.revokeApiKey(dispatch, payload),
  );
};
