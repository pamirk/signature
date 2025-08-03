import React, { useCallback } from 'react';
import { useTwillioSignIn, useGoogleAuthenticatorSignIn } from 'Hooks/Auth';
import Toast from 'Services/Toast';
import TwoFactorForm from './components/TwoFactorForm';
import { useSelector } from 'react-redux';
import { selectTwoFactorType } from 'Utils/selectors';
import { TwoFactorTypes } from 'Interfaces/Auth';
import History from 'Services/History';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

const TwoFactor = () => {
  const twoFactorType = useSelector(selectTwoFactorType);

  if (!twoFactorType) History.push(UnauthorizedRoutePaths.LOGIN);

  const [callSignInTwillio] = useTwillioSignIn();
  const [callSignInGoogleAuthenticator] = useGoogleAuthenticatorSignIn();

  const handleSignIn = useCallback(
    async values => {
      try {
        if (twoFactorType === TwoFactorTypes.TWILLIO) {
          await callSignInTwillio({ code: parseInt(values.code, 10) });
        } else {
          await callSignInGoogleAuthenticator({ code: values.code });
        }
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [callSignInGoogleAuthenticator, callSignInTwillio, twoFactorType],
  );

  return <TwoFactorForm onSubmit={handleSignIn} twoFactorType={twoFactorType} />;
};

export default TwoFactor;
