import { useDispatch } from 'react-redux';
import { useAsyncAction } from 'Hooks/Common';
import { IntegrationActionPayload } from 'Interfaces/Integration';
import { $actions } from 'Store';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: IntegrationActionPayload) =>
    $actions.integration.deactivate(dispatch, payload),
  );
};
