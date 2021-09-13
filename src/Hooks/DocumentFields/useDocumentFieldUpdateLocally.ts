import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { DocumentFieldUpdatePayload } from 'Interfaces/DocumentFields';
import { rootActions } from 'Store';

interface UpdateDocumentFieldLocally {
  (documentField: DocumentFieldUpdatePayload): void;
}

export default () => {
  const dispatch = useDispatch();

  const updateDocumentFieldLocally: UpdateDocumentFieldLocally = useCallback(
    (documentField: DocumentFieldUpdatePayload) => {
      dispatch(rootActions.documentField.updateDocumentFieldLocally(documentField));
    },
    [dispatch],
  );

  return updateDocumentFieldLocally;
};
