import { useAsyncAction } from 'Hooks/Common';
import { CodeAccessPayload } from 'Interfaces/Document';
import { useDispatch } from 'react-redux';
import { $actions } from 'Store';

export default () => {
  const dispatch = useDispatch();

  return useAsyncAction((payload: CodeAccessPayload) =>
    $actions.documentSign.sendCodeAccess(dispatch, payload),
  );
};
