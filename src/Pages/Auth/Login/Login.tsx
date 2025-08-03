import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Toast from 'Services/Toast';
import History from 'Services/History';
import { usePrimarySignIn } from 'Hooks/Auth';
import {
  isEmailConfirmationData,
  isTwoFactorResponseData,
  isUserResponseData,
} from 'Utils/typeGuards';
import { isNotEmpty } from 'Utils/functions';
import LoginForm from 'Components/AuthForm/LoginForm';
import { useBeaconRemove, useReferralTracking } from 'Hooks/Common';
import { DataLayerAnalytics } from 'Services/Integrations';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

const Login = () => {
  useBeaconRemove();
  const isMobile = useIsMobile();

  const [callSignIn, isLoading] = usePrimarySignIn();
  const referralTracking = useReferralTracking();

  const signIn = useCallback(
    async values => {
      try {
        const response = await callSignIn(values);

        if (!isNotEmpty(response)) {
          return;
        }

        if (isUserResponseData(response)) {
          DataLayerAnalytics.fireUserIdEvent(response.user);
        }

        if (isTwoFactorResponseData(response)) {
          History.push(UnauthorizedRoutePaths.TWO_FACTOR);
        }

        if (isEmailConfirmationData(response)) {
          History.push(UnauthorizedRoutePaths.CONFIRM_ACCOUNT, {
            confirmationRequired: true,
          });
        }

        if (isUserResponseData(response) && response.isNewUser) {
          DataLayerAnalytics.fireGoogleRegistrationEvent();
          Toast.success('Your account has been created.');
        }

        if (isUserResponseData(response)) {
          await referralTracking(response.user.email as string, response.user.customerId);
        }
      } catch (error) {
        Toast.error(error.message);
      }
    },
    [callSignIn, referralTracking],
  );

  return (
    <div className="auth">
      <Helmet>
        <meta name="description" content="Log in to Signaturely." />
        <title>Log In | Signaturely</title>
      </Helmet>
      <h1 className={classNames('auth__title', { mobile: isMobile })}>
        Login to your account
      </h1>
      <LoginForm
        isLoading={isLoading}
        onSubmit={signIn}
        formClassName={isMobile ? 'mobile' : ''}
      />
    </div>
  );
};

export default Login;
