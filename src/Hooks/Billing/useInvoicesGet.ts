import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { InvoiceTypes } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((type: InvoiceTypes) =>
    $actions.billing.getInvoices(dispatch, type),
  );
};
