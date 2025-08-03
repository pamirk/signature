import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { LtdPaymentCheckoutPayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: LtdPaymentCheckoutPayload) =>
    $actions.billing.upgradeLtdPaymentCheckout(dispatch, payload),
  );
};
