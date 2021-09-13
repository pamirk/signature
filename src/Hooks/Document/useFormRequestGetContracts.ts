import { useAsyncAction } from 'Hooks/Common';
import { $actions } from 'Store';
import { useDispatch } from 'react-redux';
import { ContractsPayload } from 'Interfaces/Contract';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: ContractsPayload) =>
    $actions.contracts.getFormRequestContracts(dispatch, payload),
  );
};
