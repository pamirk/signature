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
