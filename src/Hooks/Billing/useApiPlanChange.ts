import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { ApiPlanChangePayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: ApiPlanChangePayload) =>
    $actions.billing.changeApiPlan(dispatch, payload),
  );
};
