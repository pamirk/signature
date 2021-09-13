import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { CardFormValues } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((values: CardFormValues) =>
    $actions.billing.updateCard(dispatch, { values }),
  );
};
