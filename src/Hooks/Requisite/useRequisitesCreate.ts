import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from 'Hooks/Common';
import { RequisitesPayload } from 'Interfaces/Requisite';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((requisitesPayload: RequisitesPayload) =>
    $actions.requisite.createRequisites(dispatch, requisitesPayload),
  );
};
