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
import LoginForm from 'Components/AuthForm/LoginForm/LoginForm';
import { useBeaconRemove } from 'Hooks/Common';
import { DataLayerAnalytics } from 'Services/Integrations';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

const Login = () => {
  useBeaconRemove();
  const isMobile = useIsMobile();

  const [callSignIn, isLoading] = usePrimarySignIn();

  const signIn = useCallback(
    async values => {
      try {
        const response = await callSignIn(values);

        if (!isNotEmpty(response)) {
          return;
        }

        if (isTwoFactorResponseData(response)) {
          History.push('/two-factor');
        }

        if (isEmailConfirmationData(response)) {
          History.push('/confirm-account', { confirmationRequired: true });
        }

        if (isUserResponseData(response) && response.isNewUser) {
          DataLayerAnalytics.fireGoogleRegistrationEvent();
          Toast.success('Your account has been created.');
        }
      } catch (error:any) {
        Toast.error(error.message);
      }
    },
    [callSignIn],
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
