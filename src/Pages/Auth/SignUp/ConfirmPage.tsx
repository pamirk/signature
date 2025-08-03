import React, { useCallback, useEffect } from 'react';
import useSendEmailConfirmation from 'Hooks/Auth/useSendConfirmationEmail';

import { useBeaconRemove } from 'Hooks/Common';
import { ReactSVG } from 'react-svg';
import SignUpConfirmImg from 'Assets/images/bg/signUpConfirm.svg';
import UIButton from 'Components/UIComponents/UIButton';
import Toast from 'Services/Toast';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface SignUpConfirmationProps {
  confirmationRequired: boolean;
}

const SignUpConfirm = ({
  location,
  history,
}: RouteComponentProps<{}, StaticContext, SignUpConfirmationProps>) => {
  useBeaconRemove();

  useEffect(() => {
    if (!location.state || !location.state.confirmationRequired) {
      history.push(UnauthorizedRoutePaths.BASE_PATH);
    }
  });

  const { email } = useSelector(selectUser) as Required<User>;

  const [sendConformationEmail, isLoading] = useSendEmailConfirmation();

  const handleConfirmationEmailSend = useCallback(async () => {
    try {
      await sendConformationEmail({ email });
      Toast.success('Email has been sent');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [email, sendConformationEmail]);

  return (
    <div className="signup_confirm">
      <div className="signup_confirm__wrapper">
        <div className="signup_confirm__img">
          <ReactSVG src={SignUpConfirmImg} />
        </div>
        <div className="signup_confirm__text">
          <div className="signup_confirm__text--major">
            Please confirm your email address
          </div>
          <div className="signup_confirm__text--minor">
            Please check your inbox for a confirmation email from Signaturely. If you
            can&apos;t find it, please check the SPAM folder.
          </div>
        </div>
        <div className="signup_confirm__button">
          <UIButton
            priority="secondary"
            title="Resend confirmation"
            disabled={isLoading}
            handleClick={handleConfirmationEmailSend}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpConfirm;
