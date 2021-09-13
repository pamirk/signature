import React, { useCallback, useMemo, useEffect } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { RouteChildrenProps } from 'react-router-dom';
import History from 'Services/History';
import Toast from 'Services/Toast';
import useEmailConfirmToken from 'Hooks/Auth/useEmailConfirmToken';
import useConfirmEmail from 'Hooks/Auth/useConfirmEmail';
import { DataLayerAnalytics } from 'Services/Integrations';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsEmailConfirmed } from 'Utils/selectors';

function ConfirmEmail({ location }: RouteChildrenProps) {
  const [setToken, clearToken] = useEmailConfirmToken();
  const isEmailConfirmed = useSelector(selectIsEmailConfirmed);

  const [confirmEmail, isConfirmLoading] = useConfirmEmail();

  const emailToken = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    return searchParams.get('emailConfirmationToken');
  }, [location.search]);

  const navigateToRoot = useCallback(() => {
    History.replace('/');
  }, []);

  const handleEmailConfirm = useCallback(async () => {
    try {
      await confirmEmail(undefined);
      Toast.success('Email confirmed');

      DataLayerAnalytics.fireConfirmedRegistrationEvent();
      navigateToRoot();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [confirmEmail, navigateToRoot]);

  useEffect(() => {
    if (!emailToken || isEmailConfirmed) {
      return navigateToRoot();
    }

    setToken({ token: emailToken });
    handleEmailConfirm();

    return () => clearToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateToRoot, emailToken]);

  return (
    <div className="auth">
      <p className="auth__title">This action will perform automatically</p>
      <form className="auth__form auth__form--border">
        <h1 className="auth__title">Confirm Email</h1>
        <div className="auth__submitButton">
          <UIButton
            priority="primary"
            title="Retry"
            handleClick={handleEmailConfirm}
            type="submit"
            disabled={isConfirmLoading}
            isLoading={isConfirmLoading}
          />
        </div>
      </form>
    </div>
  );
}

export default ConfirmEmail;
