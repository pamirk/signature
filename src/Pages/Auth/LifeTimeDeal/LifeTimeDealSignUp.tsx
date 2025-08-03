import React, { useCallback, useMemo } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import Toast from 'Services/Toast';
import History from 'Services/History';
import { DataLayerAnalytics } from 'Services/Integrations';
import { useLtdSignUp } from 'Hooks/Auth';
import { isNotEmpty } from 'Utils/functions';
import {
  isEmailConfirmationData,
  isTwoFactorResponseData,
  isUserResponseData,
} from 'Utils/typeGuards';
import SignUpForm from 'Components/AuthForm/SignUpForm';
import { useBeaconRemove } from 'Hooks/Common';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';

const LifeTimeDealSignUp = ({ location }: RouteChildrenProps) => {
  useBeaconRemove();
  const isMobile = useIsMobile();
  const [ltdSignUp, isLoading] = useLtdSignUp();

  const initialValues = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      email: searchParams.get('email') || undefined,
      name: searchParams.get('name') || undefined,
    };
  }, [location.search]);

  const signUp = useCallback(
    async values => {
      try {
        const response = await ltdSignUp(values);

        if (!isNotEmpty(response)) {
          return;
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
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [ltdSignUp],
  );

  return (
    <div className={classNames('lifeTimeDeal__common-container', { mobile: isMobile })}>
      <div className="auth">
        <h1 className="auth__title auth__title--bold">Create account</h1>
        <h3 className="auth__title auth__title--subtitle">
          Create an account to Redeem your Lifetime License Key
        </h3>
        <SignUpForm
          initialValues={initialValues}
          isLoading={isLoading}
          onSubmit={signUp}
          needGoogleAuth={false}
          isShowFooter={true}
        />
      </div>
    </div>
  );
};

export default LifeTimeDealSignUp;
