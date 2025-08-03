import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { CreateLtdPaymentCheckoutPayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: CreateLtdPaymentCheckoutPayload) =>
    $actions.billing.createLtdPaymentCheckout(dispatch, payload),
  );
};
