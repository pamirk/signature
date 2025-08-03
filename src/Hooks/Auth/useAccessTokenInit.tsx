import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { rootActions } from 'Store';
import { TokenPayload } from 'Interfaces/User';

interface InitAccessToken {
  (payload: TokenPayload): void;
}

interface FinishInitAccessToken {
  (): void;
}

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const dispatch = useDispatch();

  const initAccessToken: InitAccessToken = useCallback(
    (payload: TokenPayload) => {
      dispatch(rootActions.user.initAccessToken(payload));
    },
    [dispatch],
  );

  const finishInitAccessToken: FinishInitAccessToken = useCallback(() => {
    dispatch(rootActions.user.finishInitAccessToken());
  }, [dispatch]);

  return [initAccessToken, finishInitAccessToken] as const;
};
