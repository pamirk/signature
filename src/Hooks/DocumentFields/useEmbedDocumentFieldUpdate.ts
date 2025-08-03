import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  DocumentFieldUpdatePayload,
  DocumentFieldsCRUDMeta,
} from 'Interfaces/DocumentFields';
import { rootActions } from 'Store';

export interface UpdateEmbedDocumentField {
  (documentField: DocumentFieldUpdatePayload, meta?: DocumentFieldsCRUDMeta): void;
}

export default () => {
  const dispatch = useDispatch();

  const updateEmbedDocumentField: UpdateEmbedDocumentField = useCallback(
    (
      documentField: DocumentFieldUpdatePayload,
      meta: DocumentFieldsCRUDMeta = { pushToHistory: true },
    ) => {
      dispatch(
        rootActions.documentField.updateEmbedDocumentField.request({
          payload: documentField,
          meta,
        }),
      );
    },
    [dispatch],
  );

  return updateEmbedDocumentField;
};
