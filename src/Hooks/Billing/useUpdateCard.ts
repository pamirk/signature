import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { CardFormValues } from 'Interfaces/Billing';

export default () => {
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return useAsyncAction((values: CardFormValues) => $actions.billing.updateCard(dispatch, { values }),);
};
