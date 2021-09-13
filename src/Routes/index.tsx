import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Toast from 'Services/Toast';
import { useCurrentUserGet } from 'Hooks/User';
import { selectAuthStatus } from 'Utils/selectors';
import { AuthStatuses } from 'Interfaces/Auth';

import UISpinner from 'Components/UIComponents/UISpinner';
import {
  AuthorizedRoutes,
  UnauthorizedRoutes,
  UnderMaintenanceRoutes,
} from './Components';
import { UNDER_MAINTENANCE } from 'Utils/constants';

function AppRouter() {
  const [getCurrentUser] = useCurrentUserGet();
  const authStatus = useSelector(selectAuthStatus);

  const handleCurrentUserGet = useCallback(async () => {
    try {
      await getCurrentUser(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!UNDER_MAINTENANCE) handleCurrentUserGet();
  }, [handleCurrentUserGet]);

  if (UNDER_MAINTENANCE) {
    return <UnderMaintenanceRoutes />;
  }

  if (authStatus === AuthStatuses.UNATHORIZED) {
    return <UnauthorizedRoutes />;
  }

  if (authStatus === AuthStatuses.AUTHOREZED) {
    return <AuthorizedRoutes />;
  }

  return <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />;
}

export default AppRouter;
