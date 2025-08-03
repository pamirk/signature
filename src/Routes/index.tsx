import React, { useEffect, useCallback, useState } from 'react';
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
  ActivateTrialRoutes,
} from './Components';
import { UNDER_MAINTENANCE } from 'Utils/constants';
import { DataLayerAnalytics } from 'Services/Integrations';
import { isNotEmpty, redirectToUserWorkflowVersion } from 'Utils/functions';

function AppRouter() {
  const [isLoading, setIsLoading] = useState(false);
  const [getCurrentUser] = useCurrentUserGet();

  const authStatus = useSelector(selectAuthStatus);

  const handleCurrentUserGet = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser(undefined);

      if (isNotEmpty(user) && user.id) {
        redirectToUserWorkflowVersion(user.workflowVersion);

        DataLayerAnalytics.fireUserIdEvent(user);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!UNDER_MAINTENANCE) handleCurrentUserGet();
  }, [handleCurrentUserGet]);

  if (isLoading)
    return <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />;

  if (UNDER_MAINTENANCE) {
    return <UnderMaintenanceRoutes />;
  }

  if (authStatus === AuthStatuses.UNAUTHORIZED) {
    return <UnauthorizedRoutes />;
  }

  if (authStatus === AuthStatuses.TRIAL) {
    return <ActivateTrialRoutes />;
  }

  if (authStatus === AuthStatuses.AUTHORIZED) {
    return <AuthorizedRoutes />;
  }

  return <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />;
}

export default AppRouter;
