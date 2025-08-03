import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { CapturePaypalOrderPayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: CapturePaypalOrderPayload) =>
    $actions.billing.capturePaypalOrder(dispatch, payload),
  );
};
