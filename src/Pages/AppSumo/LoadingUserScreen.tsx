import React, { useCallback, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import History from 'Services/History';
import { useAppSumoSignIn } from 'Hooks/Auth';
import Toast from 'Services/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAppSumoLinkUsed, selectUser } from 'Utils/selectors';
import AuthenticatedWrapper from 'Layouts/AuthenticatedWrapper';
import AppSumoThanks from './AppSumoThanks';
import SidebarSubLayout from 'Layouts/sublayouts/SidebarSubLayout';
import { AuthStatuses } from 'Interfaces/Auth';
import { User } from 'Interfaces/User';
import SimplifiedWrapper from 'Layouts/SimplifiedWrapper';
import UISpinner from 'Components/UIComponents/UISpinner';
import { applyAppSumoLink } from 'Store/ducks/user/actionCreators';
import { DataLayerAnalytics } from 'Services/Integrations';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

const LoadingUserScreen = ({ location }: RouteComponentProps) => {
  const [signIn, isLoading] = useAppSumoSignIn();
  const user: User = useSelector(selectUser);
  const dispatch = useDispatch();
  const isAppSumoLinkUsed = useSelector(selectIsAppSumoLinkUsed);
  const appSumoToken = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    return searchParams.get('appSumoToken');
  }, [location.search]);

  const navigateToRoot = useCallback(() => {
    History.replace(AuthorizedRoutePaths.BASE_PATH);
  }, []);

  const handleAppSumoSignIn = useCallback(async () => {
    try {
      await signIn({ token: appSumoToken as string });
      DataLayerAnalytics.fireAppSumoRegistrationEvent();
    } catch (error) {
      Toast.handleErrors(error);
      navigateToRoot();
    }
  }, [appSumoToken, navigateToRoot, signIn]);

  useEffect(() => {
    if (!appSumoToken) {
      return navigateToRoot();
    }

    if (!isAppSumoLinkUsed) {
      dispatch(applyAppSumoLink());
      handleAppSumoSignIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateToRoot, appSumoToken]);

  if (!user.authStatus || user.authStatus === AuthStatuses.UNAUTHORIZED || isLoading) {
    return (
      <SimplifiedWrapper location={location}>
        <UISpinner width={50} height={50} className="spinner--main__wrapper" />
      </SimplifiedWrapper>
    );
  }

  return (
    <AuthenticatedWrapper location={location}>
      <SidebarSubLayout location={location}>
        <AppSumoThanks />
      </SidebarSubLayout>
    </AuthenticatedWrapper>
  );
};

export default LoadingUserScreen;
