import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { InvoicesRequest } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: InvoicesRequest) =>
    $actions.billing.getInvoices(dispatch, payload),
  );
};
