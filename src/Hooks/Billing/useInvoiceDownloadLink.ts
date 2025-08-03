import { useDispatch } from 'react-redux';
import { useAsyncAction } from '../Common';
import { $actions } from 'Store';
import { InvoiceDownloadLink } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: InvoiceDownloadLink) =>
    $actions.billing.getInvoiceDownloadLink(dispatch, payload),
  );
};
