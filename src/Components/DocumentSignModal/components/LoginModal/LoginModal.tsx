import React, { useCallback } from 'react';
import ModalHeader from '../ModalHeader/ModalHeader';
import { usePrimarySignIn } from 'Hooks/Auth';
import UIModal from 'Components/UIComponents/UIModal';
import LoginForm from 'Components/AuthForm/LoginForm/LoginForm';
import Toast from 'Services/Toast';
import History from 'Services/History';
import {
  isEmailConfirmationData,
  isTwoFactorResponseData,
  isUserResponseData,
} from 'Utils/typeGuards';
import { isNotEmpty } from 'Utils/functions';
import { DataLayerAnalytics } from 'Services/Integrations';

interface LoginModalProps {
  onClose: () => void;
  onSignUpClick: () => void;
}

const LoginModal = ({ onClose, onSignUpClick }: LoginModalProps) => {
  const [callSignIn, isLoading] = usePrimarySignIn();

  const handleSignIn = useCallback(
    async values => {
      try {
        const response:any = await callSignIn(values);

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
    <UIModal
      onClose={onClose}
      overlayClassName="successSignModal__overlay"
      className="successSignModal"
      hideCloseIcon
    >
      <div className="successSignModal__wrapper">
        <div className="successSignModal__header-wrapper">
          <ModalHeader />
        </div>
        <div className="successSignModal__subtitle">Sign in to your account</div>
        <LoginForm
          onSignUpClick={onSignUpClick}
          formClassName="successSignModal__auth"
          onSubmit={handleSignIn}
          isLoading={isLoading}
        />
      </div>
    </UIModal>
  );
};

export default LoginModal;
