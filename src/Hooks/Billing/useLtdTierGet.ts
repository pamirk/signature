import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { GetLtdTierPayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: GetLtdTierPayload) => {
    if (payload.ltdId) {
      return $actions.billing.getLtdTier(dispatch, payload);
    }
  });
};
