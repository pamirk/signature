import { useDispatch } from 'react-redux';
import { DocumentFieldsState } from 'Interfaces/DocumentFields';
import { useCallback } from 'react';
import { rootActions } from 'Store';

interface SetDocumentFieldsMeta {
  (payload: Partial<DocumentFieldsState['meta']>): void;
}

interface ClearDocumentFieldsMeta {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const setDocumentFieldsMeta: SetDocumentFieldsMeta = useCallback(
    (payload: Partial<DocumentFieldsState['meta']>) => {
      dispatch(rootActions.documentField.changeDocumentFieldsMeta.set(payload));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const clearDocumentFieldsMeta: ClearDocumentFieldsMeta = useCallback(() => {
    dispatch(rootActions.documentField.changeDocumentFieldsMeta.clear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [setDocumentFieldsMeta, clearDocumentFieldsMeta] as const;
};
