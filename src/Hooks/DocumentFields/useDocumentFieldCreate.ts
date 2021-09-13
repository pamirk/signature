import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { rootActions } from 'Store';
import { DocumentField, DocumentFieldsCRUDMeta } from 'Interfaces/DocumentFields';

export interface CreateDocumentField {
  (documentField: DocumentField, meta?: DocumentFieldsCRUDMeta): void;
}

export default () => {
  const dispatch = useDispatch();

  const createDocumentField: CreateDocumentField = useCallback(
    (
      documentField: DocumentField,
      meta: DocumentFieldsCRUDMeta = { pushToHistory: true },
    ) =>
      dispatch(
        rootActions.documentField.createDocumentField.request({
          payload: { ...documentField, placeholder: 'Textbox' },
          meta,
        }),
      ),
    [dispatch],
  );

  return createDocumentField;
};
