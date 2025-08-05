import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rootActions } from 'Store';
import { selectDocumentFieldsMeta } from 'Utils/selectors';

interface RedoEmbedDocumentFieldAction {
  (): void;
}

interface UndoEmbedDocumentFieldAction {
  (): void;
}

export default () => {
  const dispatch = useDispatch();
  const {
    history: documentFieldsHistory,
  }: ReturnType<typeof selectDocumentFieldsMeta> = useSelector(selectDocumentFieldsMeta);

  const { isNextAvailable, isPrevAvailable } = useMemo(() => {
    const isNextAvailable = documentFieldsHistory.cursor !== 0;
    const isPrevAvailable =
      documentFieldsHistory.cursor !== documentFieldsHistory.actions.length;

    return { isNextAvailable, isPrevAvailable };
  }, [documentFieldsHistory]);

  const redoEmbedDocumentFieldAction: RedoEmbedDocumentFieldAction = useCallback(() => {
    //@ts-ignore
    dispatch(rootActions.documentField.redoEmbedDocumentFieldsHistory.request());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const undoEmbedDocumentFieldAction: UndoEmbedDocumentFieldAction = useCallback(() => {
    //@ts-ignore
    dispatch(rootActions.documentField.undoEmbedDocumentFieldsHistory.request());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [
    redoEmbedDocumentFieldAction,
    undoEmbedDocumentFieldAction,
    isNextAvailable,
    isPrevAvailable,
  ] as const;
};
