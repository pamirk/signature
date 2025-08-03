import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { ValidatePromotionCodePayload } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: ValidatePromotionCodePayload) =>
    $actions.billing.validatePromotionCode(dispatch, payload),
  );
};
