import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { rootActions } from 'Store';
import { TokenPayload } from 'Interfaces/User';

interface InitEmbedDocumentToken {
  (payload: TokenPayload): void;
}

interface RemoveEmbedDocumenToken {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const initEmbedDocumentToken: InitEmbedDocumentToken = useCallback(
    (payload: TokenPayload) => {
      dispatch(rootActions.document.initEmbedDocumentToken(payload));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const removeEmbedDocumenToken: RemoveEmbedDocumenToken = useCallback(() => {
    //@ts-ignore
    dispatch(rootActions.document.finishEmbedDocumenToken());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [initEmbedDocumentToken, removeEmbedDocumenToken] as const;
};
