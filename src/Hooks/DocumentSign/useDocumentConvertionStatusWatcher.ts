import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SignerIdPayload } from 'Interfaces/Document';
import { useAsyncAction } from 'Hooks/Common';
import { $actions, rootActions } from 'Store';

export default () => {
  const dispatch = useDispatch();

  const [request, isExecuting] = useAsyncAction((payload: SignerIdPayload) =>
    $actions.documentSign.getDocumentConvertionStatus(dispatch, payload),
  );

  const cancel = useCallback(() => {
    dispatch(rootActions.documentSign.getDocumentConvertionStatus.cancel(undefined, {}));
  }, [dispatch]);

  return [request, cancel, isExecuting] as const;
};
