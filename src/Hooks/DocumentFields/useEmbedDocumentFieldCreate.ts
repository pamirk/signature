import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { rootActions } from 'Store';
import { DocumentField, DocumentFieldsCRUDMeta } from 'Interfaces/DocumentFields';

export interface CreateEmbedDocumentField {
  (documentField: DocumentField, meta?: DocumentFieldsCRUDMeta): void;
}

export default () => {
  const dispatch = useDispatch();

  const createEmbedDocumentField: CreateEmbedDocumentField = useCallback(
    (
      documentField: DocumentField,
      meta: DocumentFieldsCRUDMeta = { pushToHistory: true },
    ) =>
      dispatch(
        rootActions.documentField.createEmbedDocumentField.request({
          payload: { ...documentField, placeholder: 'Textbox' },
          meta,
        }),
      ),
    [dispatch],
  );

  return createEmbedDocumentField;
};
