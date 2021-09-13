import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { rootActions } from 'Store';

interface CancelDocumentUpdate {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const cancelDocumentUpdate: CancelDocumentUpdate = useCallback(
    () => dispatch(rootActions.document.updateDocument.cancel(undefined, {})),
    [dispatch],
  );

  return cancelDocumentUpdate;
};
