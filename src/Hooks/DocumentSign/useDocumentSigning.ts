import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { rootActions } from 'Store';
import { TokenPayload } from 'Interfaces/User';

interface InitDocumentSigning {
  (payload: TokenPayload): void;
}

interface FinishDocumentSigning {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const initDocumentSigning: InitDocumentSigning = useCallback(
    (payload: TokenPayload) => {
      dispatch(rootActions.documentSign.initDocumentSigning(payload));
    },
    [dispatch],
  );

  const finishDocumentSigning: FinishDocumentSigning = useCallback(() => {
    dispatch(rootActions.documentSign.finishDocumentSigning());
  }, [dispatch]);

  return [initDocumentSigning, finishDocumentSigning] as const;
};
