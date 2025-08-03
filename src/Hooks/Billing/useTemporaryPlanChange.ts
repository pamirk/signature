import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { PlanChangePayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: PlanChangePayload) =>
    $actions.billing.temporaryChangePLan(dispatch, payload),
  );
};
