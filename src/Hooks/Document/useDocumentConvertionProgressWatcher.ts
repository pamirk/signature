import { useDispatch } from 'react-redux';
import { rootActions } from 'Store/ducks';
import { useCallback } from 'react';
import { DocumentIdPayload } from 'Interfaces/Document';

interface StartWatchFunc {
  (payload: DocumentIdPayload): void;
}

interface StopWatchFunc {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const startWatch = useCallback(
    (payload: DocumentIdPayload) => {
      dispatch(rootActions.document.watchDocumentConvertionProgress.start(payload));
    },
    [dispatch],
  ) as StartWatchFunc;

  const stopWatch = useCallback(() => {
    dispatch(rootActions.document.watchDocumentConvertionProgress.stop());
  }, [dispatch]) as StopWatchFunc;

  return [startWatch, stopWatch] as const;
};
