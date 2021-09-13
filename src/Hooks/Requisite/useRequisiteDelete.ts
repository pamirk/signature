import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { RequisiteDeletePayload } from 'Interfaces/Requisite';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: RequisiteDeletePayload) =>
    $actions.requisite.deleteRequisite(dispatch, payload),
  );
};
