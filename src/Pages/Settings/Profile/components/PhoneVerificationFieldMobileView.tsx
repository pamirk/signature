import React from 'react';
import { Field, Form } from 'react-final-form';
import { MaskedTextInput } from 'Components/FormFields';
import UIButton from 'Components/UIComponents/UIButton';
import { phoneNumberLength, required } from 'Utils/validation';
import { phoneNumberMaskedProps, phoneCodeMaskedProps } from 'Utils/formatters';
import { composeValidators } from 'Utils/functions';

export interface PhoneVerificationFieldMobileViewProps {
  handleVerify:any;
}

const PhoneVerificationFieldMobileView = ({
  handleVerify,
}: PhoneVerificationFieldMobileViewProps) => {
  return (
    <Form
      onSubmit={handleVerify}
      render={({ handleSubmit, submitting, hasValidationErrors }) => (
        <div>
          <div className="profile__sms-wrapper">
            <div className="profile__sms-field profile__sms-field--small mobile">
              <Field
                name="code"
                component={MaskedTextInput}
                {...phoneCodeMaskedProps}
                validate={required}
              />
            </div>
            <div className="profile__sms-field mobile">
              <Field
                name="number"
                component={MaskedTextInput}
                {...phoneNumberMaskedProps}
                validate={composeValidators(required, phoneNumberLength)}
              />
            </div>
          </div>
          <div className="profile__button profile__button--verify mobile">
            <UIButton
              priority="secondary"
              title="Activate 2FA"
              handleClick={handleSubmit}
              isLoading={submitting}
              disabled={submitting || hasValidationErrors}
            />
          </div>
          <p className="settings__text settings__text--grey">
            There may be carrier&apos;s fees for this SMS service.
          </p>
        </div>
      )}
    />
  );
};

export default PhoneVerificationFieldMobileView;
