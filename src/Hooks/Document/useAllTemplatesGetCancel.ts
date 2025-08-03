import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { rootActions } from 'Store';

interface CancelTemplatesAllGet {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const cancelDocumentUpdate: CancelTemplatesAllGet = useCallback(
    () => dispatch(rootActions.document.getAllTemplates.cancel(undefined, {})),
    [dispatch],
  );

  return cancelDocumentUpdate;
};
