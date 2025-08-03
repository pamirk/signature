import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { rootActions } from 'Store';

interface CancelEmbedDocumentUpdate {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const cancelEmbedDocumentUpdate: CancelEmbedDocumentUpdate = useCallback(
    () => dispatch(rootActions.document.updateEmbedDocument.cancel(undefined, {})),
    [dispatch],
  );

  return cancelEmbedDocumentUpdate;
};
