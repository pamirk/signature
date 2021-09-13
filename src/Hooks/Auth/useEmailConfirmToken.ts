import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { rootActions } from 'Store';
import { TokenPayload } from 'Interfaces/User';

interface SetToken {
  (payload: TokenPayload): void;
}

interface ClearToken {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const setEmailToken: SetToken = useCallback(
    (payload: TokenPayload) => {
      dispatch(rootActions.user.setEmailToken(payload));
    },
    [dispatch],
  );

  const clearEmailToken: ClearToken = useCallback(() => {
    dispatch(rootActions.user.clearEmailToken());
  }, [dispatch]);

  return [setEmailToken, clearEmailToken] as const;
};
