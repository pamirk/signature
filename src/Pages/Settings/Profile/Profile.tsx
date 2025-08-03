import React, { useState, useCallback } from 'react';
import { Form } from 'react-final-form';
import classNames from 'classnames';
import UIButton from 'Components/UIComponents/UIButton';
import { useModal } from 'Hooks/Common';
import {
  DeleteAccountModal,
  PersonalFields,
  PreferencesFields,
  NotificationsFields,
  PhoneVerificationField,
} from './components';
import { ProfileInfo, CodeScopeType } from 'Interfaces/Profile';
import Toast from 'Services/Toast';
import { useSelector } from 'react-redux';
import { selectProfileInfo, selectUser } from 'Utils/selectors';
import {
  useAccountDelete,
  useProfileInfoUpdate,
  useTwillio2fa,
  useGoogleAuthenticator,
} from 'Hooks/User';
import { useLogout } from 'Hooks/Auth';
import UIModal from 'Components/UIComponents/UIModal';
import TwoFactorForm from 'Pages/Auth/TwoFactor/components/TwoFactorForm';
import { User, UserRoles } from 'Interfaces/User';
import { TwoFactorTypes } from 'Interfaces/Auth';
import useIsMobile from 'Hooks/Common/useIsMobile';
import PhoneVerificationUnsubscribe from './components/PhoneVerificationUnsubscribe';

const Profile = () => {
  const isMobile = useIsMobile();
  const [qrCode, setQrCode] = useState<string>();
  const [updateProfileInfo] = useProfileInfoUpdate();
  const [
    generateCode,
    verifyPhone,
    disableTwillio2fa,
    isTwillioLoading,
  ] = useTwillio2fa();
  const [
    enableGoogleAuthenticator,
    verifyGoogleCode,
    disableGoogleAuthenticator,
    isGoogleAuthenticatorLoading,
  ] = useGoogleAuthenticator();

  const [phoneToVerify, setPhoneToVerify] = useState<string>();
  const [logout] = useLogout();
  const [deleteAccount, isDeleteLoading] = useAccountDelete();
  const profileInitialValues = useSelector(selectProfileInfo);
  const {
    id,
    role,
    isTwillio2fa,
    isGoogle2fa,
    phoneNumber,
    avatarUrl,
  }: User = useSelector(selectUser);

  const handlAccounteDelete = useCallback(async () => {
    try {
      await deleteAccount(undefined);
      Toast.success('Account Deleted.');
      logout(null);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [deleteAccount, logout]);

  const [showDeleteModal, closeDeleteModal] = useModal(
    () => (
      <DeleteAccountModal
        onDeleteAccount={handlAccounteDelete}
        onClose={closeDeleteModal}
        isLoading={isDeleteLoading}
      />
    ),
    [isDeleteLoading],
  );

  const handleSubmit = useCallback(
    async (values: ProfileInfo) => {
      try {
        const { phone, ...restValues } = values;
        await updateProfileInfo(restValues);
        Toast.success('Profile information updated.');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [updateProfileInfo],
  );

  const handlePhoneVerify = useCallback(
    async (code: number) => {
      try {
        await verifyPhone({ phone: phoneToVerify as string, code });
        Toast.success('Phone number is verified');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [phoneToVerify, verifyPhone],
  );

  const handleTwillioDisable = useCallback(
    async code => {
      try {
        await disableTwillio2fa({ code });
        Toast.success('Two factor authorization disabled');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [disableTwillio2fa],
  );

  const [showVerifyModal, closeVerifyModal] = useModal(
    () => (
      <UIModal onClose={closeVerifyModal}>
        <TwoFactorForm
          formClassName="profile__verify-form"
          twoFactorType={TwoFactorTypes.TWILLIO}
          isLoading={isTwillioLoading}
          onSubmit={({ code }) => {
            const phoneCode = parseInt(code, 10);

            if (isTwillio2fa) {
              handleTwillioDisable(phoneCode);
            } else {
              handlePhoneVerify(phoneCode);
            }

            closeVerifyModal();
          }}
        />
      </UIModal>
    ),
    [handlePhoneVerify],
  );

  const [showGoogleAuthenticatorModal, closeGoogleAuthenticatorModal] = useModal(
    () => (
      <UIModal onClose={closeGoogleAuthenticatorModal}>
        <TwoFactorForm
          twoFactorType={TwoFactorTypes.GOOGLE}
          formClassName="profile__google-form"
          title={
            isGoogle2fa
              ? 'To confirm this action, enter the code from Google Authenticator'
              : 'Use Google Authenticator application to scan QR code'
          }
          isLoading={isGoogleAuthenticatorLoading}
          imageSrc={qrCode}
          onSubmit={async ({ code }) => {
            try {
              if (isGoogle2fa) {
                await disableGoogleAuthenticator({ code });

                Toast.success('Google Authenticator authorization disabled');
              } else {
                await verifyGoogleCode({ code });

                Toast.success('Google Authenticator successfully verified');
              }

              setQrCode(undefined);
              closeGoogleAuthenticatorModal();
            } catch (error) {
              Toast.handleErrors(error);
            }
          }}
        />
      </UIModal>
    ),
    [handlePhoneVerify, qrCode, isGoogle2fa],
  );

  const handleGoogleAuthenticator = useCallback(async () => {
    try {
      if (!isGoogle2fa) {
        const imageFile = await enableGoogleAuthenticator(undefined);
        const fileURL = URL.createObjectURL(imageFile);
        setQrCode(fileURL);
      }

      showGoogleAuthenticatorModal();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [enableGoogleAuthenticator, isGoogle2fa, showGoogleAuthenticatorModal]);

  const handleCodeGenerate = useCallback(
    async ({ phone, recaptcha }, scope: CodeScopeType = CodeScopeType.VERIFY) => {
      try {
        await generateCode({ recaptcha, phone, scope });
        setPhoneToVerify(phone);
        showVerifyModal();
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [generateCode, showVerifyModal],
  );

  return (
    <div className="profile">
      <Form
        onSubmit={handleSubmit}
        keepDirtyOnReinitialize
        initialValues={profileInitialValues}
        render={({ handleSubmit, pristine, hasValidationErrors, submitting }) => (
          <form onSubmit={handleSubmit} className="settings__form">
            <PersonalFields
              isUser={role === UserRoles.USER}
              userId={id}
              avatarUrl={avatarUrl}
              updateProfileInfo={updateProfileInfo}
            />
            <PreferencesFields />
            <NotificationsFields />

            <div
              className={classNames('settings__block', {
                'profile__two-factor-block': isTwillio2fa,
              })}
            >
              <div
                className={classNames('settings__block--middle', { mobile: isMobile })}
              >
                <h1 className="settings__title profile__header">
                  2-Factor Authentication
                </h1>
                <p className="profile__auth settings__text settings__text--grey">
                  Add an extra layer of security to your account by requiring a
                  verification code when signing in.
                </p>
                <div className="settings__field">
                  <h2 className="settings__subtitle settings__subtitle--small">
                    SMS 2-Factor Authenthicator
                  </h2>
                  {isTwillio2fa ? (
                    <PhoneVerificationUnsubscribe
                      isLoading={isTwillioLoading}
                      phoneNumber={phoneNumber}
                      handleCodeGenerate={handleCodeGenerate}
                    />
                  ) : (
                    <PhoneVerificationField
                      isLoading={isTwillioLoading}
                      onNumberSend={handleCodeGenerate}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="settings__block">
              <h2 className="profile__header settings__subtitle settings__subtitle--small">
                Google Authenticator
              </h2>
              <p className="settings__text settings__text--grey profile__auth-description">
                Generate 2FA codes directly in your Google Authenthicator app.
              </p>
              <div className="profile__button profile__button--setup">
                <UIButton
                  priority="secondary"
                  title={isGoogle2fa ? 'Disable' : 'Set Up'}
                  isLoading={isGoogleAuthenticatorLoading}
                  handleClick={handleGoogleAuthenticator}
                  disabled={isGoogleAuthenticatorLoading}
                />
              </div>
            </div>
            <div className="settings__block">
              <h2 className="settings__subtitle settings__subtitle--small">
                Delete Account
              </h2>
              <div className="profile__button profile__button--delete">
                <UIButton
                  priority="secondary"
                  title="Delete my Account"
                  handleClick={showDeleteModal}
                />
              </div>
              <p className="settings__text settings__text--grey">
                If you would like to remove all your data from the Signaturely servers,
                <br />
                please proceed with this action. This action is not reversible.
              </p>
            </div>
            <div className="profile__button profile__button--save">
              <UIButton
                priority="primary"
                title="Save"
                type="submit"
                disabled={hasValidationErrors || pristine || submitting}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default Profile;
