import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { CreateSubscriptionCheckoutPayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: CreateSubscriptionCheckoutPayload) =>
    $actions.billing.getUpcomingInvoice(dispatch, payload),
  );
};
