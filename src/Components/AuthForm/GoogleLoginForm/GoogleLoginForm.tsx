import React, { useCallback } from 'react';
import { GOOGLE_CLIENT_ID } from 'Utils/constants';
import GoogleButton from './GoogleButton';
import GoogleLogin from 'react-google-login';
import Toast from 'Services/Toast';
import { SignUpData } from 'Interfaces/Auth';
import { OnSubmitReturnType } from 'Interfaces/FinalForm';

interface GoogleLoginFormProps {
  onSubmit: (values: SignUpData) => OnSubmitReturnType;
  buttonLabel: string;
}

const GoogleLoginForm = ({ onSubmit, buttonLabel }: GoogleLoginFormProps) => {
  const handleSuccess = useCallback(
    response => {
      onSubmit({
        email: response.profileObj.email,
        id_token: response.tokenId,
        name: response.profileObj.name,
      });
    },
    [onSubmit],
  );

  const handleFailure = useCallback(response => {
    switch (response.error) {
      case 'access_denied':
        Toast.error('Access denied');
        break;
      case 'popup_closed_by_user':
        Toast.error('You need to select your Google account in the pop-up window.');
        break;
      case 'idpiframe_initialization_failed':
        break;
      default:
        Toast.error();
    }
  }, []);

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      render={renderProps => (
        <GoogleButton title={buttonLabel} handleClick={renderProps.onClick} />
      )}
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={'single_host_origin'}
      prompt={'select_account'}
    />
  );
};

export default GoogleLoginForm;
