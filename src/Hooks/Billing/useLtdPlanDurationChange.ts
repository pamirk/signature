import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { ChangeLtdPlanDurationPayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: ChangeLtdPlanDurationPayload) =>
    $actions.billing.changeLtdPlanDuration(dispatch, payload),
  );
};
