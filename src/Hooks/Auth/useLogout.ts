import { useDispatch } from 'react-redux';
import { $actions } from 'Store/ducks';
import { useAsyncAction } from '../Common';
import StorageService from 'Services/Storage';
import { useCallback } from 'react';
import { logout as logoutAction } from 'Store/ducks/user/actionCreators';

interface Logout {
  (): void;
}

export default () => {
  const dispatch = useDispatch();

  if (!StorageService.getAccessToken()) {
    return useAsyncAction(() => $actions.user.signOut(dispatch));
  } else {
    // fallback for JWT users logout

    const logout = useCallback(() => {
      dispatch(logoutAction());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) as Logout;

    return [logout];
  }
};
