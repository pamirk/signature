import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { FieldTextInput } from 'Components/FormFields';
import UIButton from 'Components/UIComponents/UIButton';
import { email as emailValidator, required } from 'Utils/validation';
import { toLowerCaseAndRemoveEmptyCharacters } from 'Utils/formatters';
import { composeValidators } from 'Utils/functions';
import { useModal } from 'Hooks/Common';
import UIModal from 'Components/UIComponents/UIModal';
import { AnyObject } from 'final-form';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import ReCAPTCHA from 'react-google-recaptcha';
import { REACT_APP_GOOGLE_RECAPTCHA_SITEKEY } from 'Utils/constants';
import ConfirmModal from 'Components/ConfirmModal';
import { ReactSVG } from 'react-svg';
import LockIcon from 'Assets/images/icons/lock.svg';

interface ChangeEmailFieldsProps {
  handleSubmit: () => Promise<AnyObject | undefined> | undefined;
  isDisabled: boolean;
  isFieldDisabled: boolean;
  emailValue?: string;
  isAppSumo: boolean;
  form;
}

const ChangeEmailFields = ({
  handleSubmit,
  isDisabled,
  isFieldDisabled,
  emailValue,
  isAppSumo,
  form,
}: ChangeEmailFieldsProps) => {
  const isMobile = useIsMobile();
  const [captchaKey, setCaptchaKey] = useState<string>();

  const [showModal, closeModal] = useModal(() => {
    return (
      <UIModal
        onClose={() => {
          form.change('recaptcha', undefined);
          setCaptchaKey(undefined);
          closeModal();
        }}
      >
        <div
          className={classNames('profile__modal profile__email-modal', {
            mobile: isMobile,
          })}
        >
          <div className="profile__modal-title">You’re about to update your email</div>
          <div className="profile__modal-description profile__modal-description--email settings__text">
            We’ll send you a confirmation email to your new email address at&nbsp;
            <span className="profile__email">{emailValue}</span>
          </div>
          <div className="profile__modal-recaptcha-wrapper">
            <ReCAPTCHA
              sitekey={REACT_APP_GOOGLE_RECAPTCHA_SITEKEY}
              onChange={e => {
                setCaptchaKey(e);
                form.change('recaptcha', e);
              }}
            />
          </div>
          <div className="profile__modal-button-wrapper">
            <UIButton
              className="profile__email-modal-button"
              title="Update email"
              priority="primary"
              disabled={!captchaKey}
              handleClick={async () => {
                await handleSubmit();
                form.change('recaptcha', undefined);
                setCaptchaKey(undefined);
              }}
            />
          </div>
          <div
            className="profile__modal-button--delete"
            onClick={() => {
              form.change('recaptcha', undefined);
              setCaptchaKey(undefined);
              return closeModal();
            }}
          >
            No, cancel
          </div>
        </div>
      </UIModal>
    );
  }, [handleSubmit, captchaKey]);

  const [showSupportModal, closeSupportModal] = useModal(() => {
    return (
      <ConfirmModal
        isCancellable={false}
        onClose={closeSupportModal}
        onConfirm={closeSupportModal}
        confirmButtonProps={{
          priority: 'primary',
          className: 'profile__email-modal-button',
        }}
        confirmText="Understood"
      >
        <div
          className={classNames('profile__email-modal profile__modal appsumo', {
            mobile: isMobile,
          })}
        >
          <div className="profile__modal-title">Name and Email Address Update</div>
          <div className="profile__modal-description profile__modal-description--appsumo settings__text">
            To update your name or email address, please contact our support team at&nbsp;
            <b>support@signaturely.com</b>. This process helps us prevent unauthorized
            account changes.
          </div>
        </div>
      </ConfirmModal>
    );
  }, [handleSubmit, captchaKey]);

  return (
    <div className={classNames('settings__block--small', { mobile: isMobile })}>
      <div
        className={classNames('settings__field', {
          lock: isAppSumo,
          mobile: isMobile,
        })}
      >
        <Field
          name="email"
          label="Email Address"
          component={FieldTextInput}
          parse={toLowerCaseAndRemoveEmptyCharacters}
          placeholder="username@gmail.com"
          disabled={isFieldDisabled || isAppSumo}
          validate={composeValidators<string>(required, emailValidator)}
        />
        {isAppSumo && (
          <ReactSVG
            src={LockIcon}
            className={classNames('profile__email-lock-icon', { mobile: isMobile })}
          />
        )}
      </div>
      <div className="profile__email-button">
        <UIButton
          priority="secondary"
          title="Update Email"
          handleClick={() => {
            isAppSumo ? showSupportModal() : showModal();
          }}
          disabled={isDisabled}
          ariaDisabled={isAppSumo}
        />
      </div>
    </div>
  );
};

export default ChangeEmailFields;
