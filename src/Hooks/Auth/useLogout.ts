import { useDispatch } from 'react-redux';
import { logout as logoutAction } from 'Store/ducks/user/actionCreators';
import { useCallback } from 'react';

interface Logout {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    dispatch(logoutAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) as Logout;

  return logout;
};
