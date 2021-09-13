import React, { useCallback } from 'react';
import ResetForm from './components/ResetForm';
import { useToggler } from 'Hooks/Common';
import CheckInbox from './components/CheckInbox';
import Toast from 'Services/Toast';
import { usePasswordChangeEmailSend } from 'Hooks/Auth';

const ForgotPassword = () => {
  const [isSubmitted, toggleIsSubmitted] = useToggler(false);
  const [sendPasswordChangeEmail] = usePasswordChangeEmailSend();
  const handlePasswordChangeEmailSend = useCallback(
    async values => {
      try {
        await sendPasswordChangeEmail(values);
        toggleIsSubmitted();
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [sendPasswordChangeEmail, toggleIsSubmitted],
  );

  if (!isSubmitted) {
    return <ResetForm onSubmit={handlePasswordChangeEmailSend} />;
  }

  return <CheckInbox />;
};

export default ForgotPassword;
