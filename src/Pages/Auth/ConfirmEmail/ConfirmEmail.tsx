import React, { useCallback, useMemo, useEffect } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { RouteChildrenProps } from 'react-router-dom';
import History from 'Services/History';
import Toast from 'Services/Toast';
import useEmailConfirmToken from 'Hooks/Auth/useEmailConfirmToken';
import useConfirmEmail from 'Hooks/Auth/useConfirmEmail';
import { DataLayerAnalytics } from 'Services/Integrations';
import { useSelector } from 'react-redux';
import { selectIsEmailConfirmed } from 'Utils/selectors';
import jwt_decode from 'jwt-decode';
import { isNewTrialUser, isNotEmpty } from 'Utils/functions';
import { useCurrentUserGet } from 'Hooks/User';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { isTwoFactorResponseData } from 'Utils/typeGuards';
import { useConfirmEmailByTwilio } from 'Hooks/Auth';
import { useModal } from 'react-modal-hook';
import UIModal from 'Components/UIComponents/UIModal';
import TwoFactorForm from '../TwoFactor/components/TwoFactorForm';
import { AuthResponseData, TwoFactorTypes } from 'Interfaces/Auth';

function ConfirmEmail({ location }: RouteChildrenProps) {
  const [getCurrentUser] = useCurrentUserGet();
  const [setToken, clearToken] = useEmailConfirmToken();
  const isEmailConfirmed = useSelector(selectIsEmailConfirmed);

  const [confirmEmail, isConfirmLoading] = useConfirmEmail();
  const [confirmEmailByTwilio, isConfirmByTwilioLoading] = useConfirmEmailByTwilio();

  const [emailToken, subject, targetEmail, redirectUrl] = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('emailConfirmationToken');

    if (token) {
      const parsedToken: any = jwt_decode(token);

      return [token, parsedToken.sub, parsedToken.email, parsedToken.redirect];
    }

    return [token, undefined, undefined, undefined];
  }, [location.search]);

  const navigateToRoot = useCallback(() => {
    if (redirectUrl) {
      window.location.replace(redirectUrl);
    } else {
      History.replace(AuthorizedRoutePaths.BASE_PATH);
    }
  }, [redirectUrl]);

  const handleConfirmContinue = useCallback(
    async (res: {} | AuthResponseData) => {
      const user = isNotEmpty(res) && res.user;

      if (isNotEmpty(res) && res.isSubscriptionRecover) {
        await getCurrentUser(undefined);
        Toast.success('Subscriptions have been recovered');
      }

      Toast.success('Email confirmed');

      if (subject) {
        DataLayerAnalytics.fireConfirmedRegistrationEvent(subject);
      }

      (!user || (user && !isNewTrialUser(user))) && navigateToRoot();
    },
    [getCurrentUser, navigateToRoot, subject],
  );

  const handleEmailConfirmByTwilio = useCallback(
    async code => {
      try {
        const res = await confirmEmailByTwilio({ code, email: targetEmail });

        handleConfirmContinue(res);
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [confirmEmailByTwilio, emailToken, navigateToRoot],
  );

  const [showTwoFactorModal, closeTwoFactorModal] = useModal(
    () => (
      <UIModal
        onClose={() => {
          closeTwoFactorModal();
        }}
      >
        <TwoFactorForm
          formClassName="profile__verify-form"
          twoFactorType={TwoFactorTypes.TWILLIO}
          isLoading={isConfirmByTwilioLoading}
          onSubmit={async ({ code }) => {
            const phoneCode = parseInt(code, 10);

            await handleEmailConfirmByTwilio(phoneCode);

            closeTwoFactorModal();
          }}
        />
      </UIModal>
    ),
    [handleEmailConfirmByTwilio],
  );

  const handleEmailConfirm = useCallback(async () => {
    try {
      const res = await confirmEmail(undefined);

      if (isNotEmpty(res) && isTwoFactorResponseData(res)) {
        showTwoFactorModal();
        return;
      }

      handleConfirmContinue(res);
    } catch (error) {
      Toast.error(error.message, { toastId: 'confirm_email_error' });
    }
  }, [confirmEmail, handleConfirmContinue, showTwoFactorModal]);

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
            disabled={isConfirmLoading || isEmailConfirmed}
            isLoading={isConfirmLoading || isEmailConfirmed}
          />
        </div>
      </form>
    </div>
  );
}

export default ConfirmEmail;
