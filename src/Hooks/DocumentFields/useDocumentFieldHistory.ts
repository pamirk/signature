import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rootActions } from 'Store';
import { selectDocumentFieldsMeta } from 'Utils/selectors';

interface RedoDocumentFieldAction {
  (): void;
}

interface UndoDocumentFieldAction {
  (): void;
}

type isNextAvailable = {} & boolean;

type isPrevAvailable = {} & boolean;

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

  const redoDocumentFieldAction: RedoDocumentFieldAction = useCallback(() => {
    //@ts-ignore
    dispatch(rootActions.documentField.redoDocumentFieldsHistory.request());
  }, [dispatch]);

  const undoDocumentFieldAction: UndoDocumentFieldAction = useCallback(() => {
    //@ts-ignore
    dispatch(rootActions.documentField.undoDocumentFieldsHistory.request());
  }, [dispatch]);

  return [
    redoDocumentFieldAction,
    undoDocumentFieldAction,
    isNextAvailable as isNextAvailable,
    isPrevAvailable as isPrevAvailable,
  ] as const;
};
