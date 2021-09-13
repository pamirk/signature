import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { AppSumoUpgradePayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: AppSumoUpgradePayload) =>
    $actions.billing.upgradeAppSumo(dispatch, payload),
  );
};
