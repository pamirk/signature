import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { rootActions } from 'Store';
import {
  DocumentFieldDeletePayload,
  DocumentFieldsCRUDMeta,
} from 'Interfaces/DocumentFields';

export interface DeleteDocumentField {
  (payload: DocumentFieldDeletePayload, meta?: DocumentFieldsCRUDMeta): void;
}

export default () => {
  const dispatch = useDispatch();

  const deleteDocumentField: DeleteDocumentField = useCallback(
    (
      payload: DocumentFieldDeletePayload,
      meta: DocumentFieldsCRUDMeta = { pushToHistory: true },
    ) => {
      dispatch(
        rootActions.documentField.deleteDocumentField.request({
          payload,
          meta,
        }),
      );
    },
    [dispatch],
  );

  return deleteDocumentField;
};
