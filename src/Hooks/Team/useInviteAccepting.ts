import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { rootActions } from 'Store';
import { TokenPayload } from 'Interfaces/User';

interface InitInviteAccepting {
  (payload: TokenPayload): void;
}

interface FinishInviteAccepting {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const initInviteAccepting: InitInviteAccepting = useCallback(
    (payload: TokenPayload) => {
      dispatch(rootActions.team.initInviteAccepting(payload));
    },
    [dispatch],
  );

  const finishInviteAccepting: FinishInviteAccepting = useCallback(() => {
    dispatch(rootActions.team.finishInviteAccepting());
  }, [dispatch]);

  return [initInviteAccepting, finishInviteAccepting] as const;
};
