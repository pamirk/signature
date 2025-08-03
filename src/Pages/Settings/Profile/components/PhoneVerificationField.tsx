import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { MaskedTextInput } from 'Components/FormFields';
import UIButton from 'Components/UIComponents/UIButton';
import { phoneNumberLength, required } from 'Utils/validation';
import { phoneNumberMaskedProps, phoneCodeMaskedProps } from 'Utils/formatters';
import { composeValidators } from 'Utils/functions';
import ReCAPTCHA from 'react-google-recaptcha';
import useIsMobile from 'Hooks/Common/useIsMobile';
import PhoneVerificationFieldMobileView from './PhoneVerificationFieldMobileView';
import { REACT_APP_GOOGLE_RECAPTCHA_SITEKEY } from 'Utils/constants';

export interface PhoneVerificationFieldProps {
  onNumberSend: (param: { phone: string; recaptcha: string }) => void;
  isLoading?: boolean;
}

const PhoneVerificationField = ({ onNumberSend }: PhoneVerificationFieldProps) => {
  const isMobile = useIsMobile();
  const handleVerify = useCallback(
    async values => {
      await onNumberSend({
        phone: `${values.code}${values.number}`,
        recaptcha: values.recaptcha,
      });
    },
    [onNumberSend],
  );

  return isMobile ? (
    <PhoneVerificationFieldMobileView handleVerify={handleVerify} />
  ) : (
    <Form
      onSubmit={handleVerify}
      render={({ handleSubmit, submitting, hasValidationErrors }) => (
        <div>
          <div className="profile__sms-wrapper">
            <div className="profile__sms-field profile__sms-field--small">
              <Field
                name="code"
                component={MaskedTextInput}
                {...phoneCodeMaskedProps}
                validate={required}
              />
            </div>
            <div className="profile__sms-field">
              <Field
                name="number"
                component={MaskedTextInput}
                {...phoneNumberMaskedProps}
                validate={composeValidators(required, phoneNumberLength)}
              />
            </div>
          </div>
          <div className="profile__sms-recaptcha-wrapper">
            <Field
              validate={required}
              name="recaptcha"
              render={({ input: { onChange } }) => (
                <ReCAPTCHA
                  sitekey={REACT_APP_GOOGLE_RECAPTCHA_SITEKEY}
                  onChange={onChange}
                />
              )}
            />
          </div>
          <div className="profile__button profile__button--verify">
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

export default PhoneVerificationField;
