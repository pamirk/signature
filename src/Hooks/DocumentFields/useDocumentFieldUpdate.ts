import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  DocumentFieldUpdatePayload,
  DocumentFieldsCRUDMeta,
} from 'Interfaces/DocumentFields';
import { rootActions } from 'Store';

export interface UpdateDocumentField {
  (documentField: DocumentFieldUpdatePayload, meta?: DocumentFieldsCRUDMeta): void;
}

export default () => {
  const dispatch = useDispatch();

  const updateDocumentField: UpdateDocumentField = useCallback(
    (
      documentField: DocumentFieldUpdatePayload,
      meta: DocumentFieldsCRUDMeta = { pushToHistory: true },
    ) => {
      dispatch(
        rootActions.documentField.updateDocumentField.request({
          payload: documentField,
          meta,
        }),
      );
    },
    [],
  );

  return updateDocumentField;
};
