import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { PlanCancelPayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: PlanCancelPayload) =>
    $actions.billing.cancelPlan(dispatch, payload),
  );
};
