import React, { useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import { DataLayerAnalytics, FacebookPixel } from 'Services/Integrations';
import Toast from 'Services/Toast';
import { useSignUp } from 'Hooks/Auth';
import SignUpForm from 'Components/AuthForm/SignUpForm';

import Logo from 'Assets/images/logoWhite.svg';
import {
  isEmailConfirmationData,
  isTwoFactorResponseData,
  isUserResponseData,
} from 'Utils/typeGuards';
import { isNotEmpty } from 'Utils/functions';
import History from 'Services/History';
import Bing from 'Services/Integrations/Analytics/Bing';

interface SignUpSide {
  onClose: () => void;
  onSignInClick: () => void;
}

const SignUpSide = ({ onClose, onSignInClick }: SignUpSide) => {
  const [callSignUp, isLoading] = useSignUp();

  const signUp = useCallback(
    async values => {
      try {
        const response = await callSignUp(values);
        FacebookPixel.fireRegistrationEvent();
        Bing.fireRegistrationEvent();

        if (!isNotEmpty(response)) {
          return onClose();
        }
        if (isTwoFactorResponseData(response)) {
          History.push('/two-factor');
        }

        if (isEmailConfirmationData(response)) {
          DataLayerAnalytics.fireUnconfirmedRegistrationEvent();
          History.push('/confirm-account', { confirmationRequired: true });
        }

        if (isUserResponseData(response) && response.isNewUser) {
          DataLayerAnalytics.fireGoogleRegistrationEvent();
          Toast.success('Your account has been created.');
        }
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [callSignUp, onClose],
  );

  return (
    <div className="successSignUpModal__right-side-wrapper">
      <div className="successSignUpModal__right-side">
        <ReactSVG src={Logo} className="successSignUpModal__logo" />
        <div className="successSignUpModal__subtitle successSignUpModal__subtitle--margin">
          Try Signaturely for Free
        </div>
        <div className="successSignUpModal__text">
          Sign up for a FREE Signaturely account today and sign all your documents
          electronically.
        </div>
        <SignUpForm
          onSignInClick={onSignInClick}
          formClassName="successSignUpModal__auth"
          submitButtonClassName="successSignUpModal__button--submit"
          fieldClassName="successSignUpModal__field"
          onSubmit={signUp}
          isLoading={isLoading}
          isShowFooter={false}
        />
      </div>
    </div>
  );
};

export default SignUpSide;
