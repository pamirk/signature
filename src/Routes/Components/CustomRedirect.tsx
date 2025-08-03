import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import StorageService from 'Services/Storage';
import {
  AuthorizedRoutePaths,
  RoutePaths,
  UnauthorizedRoutePaths,
} from 'Interfaces/RoutePaths';
import { WORKFLOW_PREFIX } from 'Utils/constants';

const customRedirectionMap = new Map<string, string>([
  [AuthorizedRoutePaths.REDEEM_LTD_CODE, UnauthorizedRoutePaths.SIGN_UP_LTD],
]);

interface CustomRedirectProps {
  to: string;
  isAuth?: boolean;
}

const CustomRedirect = ({ to, isAuth }: CustomRedirectProps) => {
  const location = useLocation();
  let redirectRoute = to;

  if (!isAuth && location?.pathname && location?.pathname !== RoutePaths.BASE_PATH) {
    const pathName = location.pathname;
    const route = pathName.slice(WORKFLOW_PREFIX.length, pathName.length);
    StorageService.setRedirectRoutePath(route);
  }

  if (isAuth) {
    redirectRoute = StorageService.getRedirectRoutePath()
      ? `${WORKFLOW_PREFIX}${StorageService.getRedirectRoutePath()}`
      : to;
    StorageService.removeRedirectRoutePath();
  }

  const customRedirectionPath = customRedirectionMap.get(location.pathname);

  if (customRedirectionPath) {
    redirectRoute = customRedirectionPath;
  }

  return <Redirect to={redirectRoute} />;
};

export default CustomRedirect;
