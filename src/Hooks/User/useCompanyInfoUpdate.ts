import { useDispatch } from 'react-redux';
import { $actions } from 'Store';
import { useAsyncAction } from 'Hooks/Common';
import { Company } from 'Interfaces/User';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction(async (payload: Company) =>
    $actions.user.updateCompanyInfo(dispatch, payload),
  );
};
