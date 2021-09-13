import React from 'react';
import { Field } from 'react-final-form';
import { FieldTextInput } from 'Components/FormFields';
import UIButton from 'Components/UIComponents/UIButton';
import { email as emailValidator, required } from 'Utils/validation';
import { toLowerCase } from 'Utils/formatters';
import { composeValidators } from 'Utils/functions';
import { useModal } from 'Hooks/Common';
import UIModal from 'Components/UIComponents/UIModal';
import { AnyObject } from 'final-form';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

interface ChangeEmailFieldsProps {
  handleSubmit: () => Promise<AnyObject | undefined> | undefined;
  isDisabled: boolean;
  isFieldDisabled: boolean;
  emailValue?: string;
}

const ChangeEmailFields = ({
  handleSubmit,
  isDisabled,
  isFieldDisabled,
  emailValue,
}: ChangeEmailFieldsProps) => {
  const isMobile = useIsMobile();
  const [showModal, closeModal] = useModal(() => {
    return (
      <UIModal onClose={closeModal}>
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
          <div className="profile__modal-button-wrapper">
            <UIButton
              className="profile__email-modal-button"
              title="Update email"
              priority="primary"
              handleClick={async () => {
                await handleSubmit();
                closeModal();
              }}
            />
          </div>
          <div className="profile__modal-button--delete" onClick={closeModal}>
            No, cancel
          </div>
        </div>
      </UIModal>
    );
  }, [handleSubmit]);

  return (
    <div className={classNames('settings__block--small', { mobile: isMobile })}>
      <div className="settings__field">
        <Field
          name="email"
          label="Email Address"
          component={FieldTextInput}
          parse={toLowerCase}
          placeholder="username@gmail.com"
          disabled={isFieldDisabled}
          validate={composeValidators<string>(required, emailValidator)}
        />
      </div>
      <div className="profile__email-button">
        <UIButton
          priority="secondary"
          title="Update Email"
          handleClick={showModal}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};

export default ChangeEmailFields;
