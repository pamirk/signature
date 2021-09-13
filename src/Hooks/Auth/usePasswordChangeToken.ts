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

  const setPasswordToken: SetToken = useCallback(
    (payload: TokenPayload) => {
      dispatch(rootActions.user.setPasswordToken(payload));
    },
    [dispatch],
  );

  const clearPasswordToken: ClearToken = useCallback(() => {
    dispatch(rootActions.user.clearPasswordToken());
  }, [dispatch]);

  return [setPasswordToken, clearPasswordToken] as const;
};
