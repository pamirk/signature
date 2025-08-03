import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { LtdCodePayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: LtdCodePayload) =>
    $actions.billing.validateLtdCode(dispatch, payload),
  );
};
