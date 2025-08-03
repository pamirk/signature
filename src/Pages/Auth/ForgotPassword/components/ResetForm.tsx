import React from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FieldTextInput from 'Components/FormFields/FieldTextInput';
import UIButton from 'Components/UIComponents/UIButton';
import { required, email } from 'Utils/validation';
import { AuthData } from 'Interfaces/Auth';
import { composeValidators } from 'Utils/functions';
import { toLowerCaseAndRemoveEmptyCharacters } from 'Utils/formatters';
import ReCAPTCHA from 'react-google-recaptcha';
import { REACT_APP_GOOGLE_RECAPTCHA_SITEKEY } from 'Utils/constants';

interface ResetFormProps {
  onSubmit: (values: AuthData) => void;
}

function ResetForm({ onSubmit }: ResetFormProps) {
  return (
    <div className="auth">
      <h1 className="auth__title">Reset Password</h1>
      <p className="auth__description">
        Please enter your email address to request a password reset.
      </p>
      <Form
        onSubmit={onSubmit}
        mutators={{ ...arrayMutators }}
        render={({
          handleSubmit,
          submitting,
          pristine,
          hasValidationErrors,
        }: FormRenderProps<AuthData>) => (
          <form className="auth__form auth__form--border">
            <Field
              name="email"
              label="Email Address"
              component={FieldTextInput}
              placeholder="username@gmail.com"
              parse={toLowerCaseAndRemoveEmptyCharacters}
              validate={composeValidators<string>(required, email)}
            />
            <div className="recaptcha__wrapper">
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
            <div className="auth__submitButton">
              <UIButton
                priority="primary"
                title="Reset password"
                handleClick={handleSubmit}
                type="submit"
                disabled={pristine || submitting || hasValidationErrors}
                isLoading={submitting}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
}

export default ResetForm;
