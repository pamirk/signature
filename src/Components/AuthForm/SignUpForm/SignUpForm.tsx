import React, { useCallback } from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';

import { SignUpData } from 'Interfaces/Auth';
import FieldTextInput from 'Components/FormFields/FieldTextInput';
import UIButton from 'Components/UIComponents/UIButton';
import { required, email, password } from 'Utils/validation';
import { composeValidators } from 'Utils/functions';
import FieldPasswordInput from 'Components/FormFields/FieldPasswordInput';
import UISpinner from 'Components/UIComponents/UISpinner';
import { toLowerCaseAndRemoveEmptyCharacters } from 'Utils/formatters';
import GoogleLoginForm from '../GoogleLoginForm';
import History from 'Services/History';
import { AuthFormProps } from '../interfaces/AuthFormProps';
import { RoutePaths } from 'Interfaces/RoutePaths';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface SignUpFormProps extends AuthFormProps {
  isShowFooter?: boolean;
  submitButtonClassName?: string;
  fieldClassName?: string;
  onSignInClick?: () => void;
  initialValues?: Partial<SignUpData>;
  needGoogleAuth?: boolean;
}

function SignUpForm({
  onSubmit,
  isLoading,
  formClassName,
  fieldClassName,
  submitButtonClassName,
  onSignInClick,
  isShowFooter = true,
  initialValues,
  needGoogleAuth = true,
}: SignUpFormProps) {
  const navigateToSignIn = useCallback(() => History.push(RoutePaths.BASE_PATH), []);
  const isMobile = useIsMobile();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues as SignUpData}
      mutators={{ ...arrayMutators }}
      render={({
        handleSubmit,
        submitting,
        pristine,
        hasValidationErrors,
      }: FormRenderProps<SignUpData>) => (
        <form className={classNames('auth__form auth__form--signup', formClassName)}>
          <Field
            name="name"
            label="Name"
            className={fieldClassName}
            component={FieldTextInput}
            placeholder="Full Name"
            validate={required}
          />
          <Field
            name="email"
            label="Email Address"
            className={fieldClassName}
            component={FieldTextInput}
            placeholder="username@gmail.com"
            parse={toLowerCaseAndRemoveEmptyCharacters}
            validate={composeValidators<string>(required, email)}
          />
          <Field
            name="password"
            label="Password"
            type="password"
            className={fieldClassName}
            component={FieldPasswordInput}
            placeholder="Your password"
            validate={composeValidators<string>(required, password)}
          />
          <div className="auth__acception">
            By clicking Create Account{needGoogleAuth && ' or Sign Up with Google'}, I
            agree to the&nbsp;
            <a
              className="auth__link"
              href="https://signaturely.com/terms/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Use
            </a>
            ,&nbsp;
            <a
              className="auth__link"
              href="https://signaturely.com/electronic-signature-disclosure-and-consent"
              target="_blank"
              rel="noopener noreferrer"
            >
              Electronic Signature Disclosure and Consent
            </a>
            &nbsp;and&nbsp;
            <a
              className="auth__link"
              href="https://signaturely.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            .
          </div>
          <div className="auth__submitButton">
            {isLoading ? (
              <UISpinner
                wrapperClassName="spinner--main__wrapper"
                width={40}
                height={40}
              />
            ) : (
              <UIButton
                priority="primary"
                title="Create account"
                handleClick={handleSubmit}
                type="submit"
                disabled={pristine || submitting || hasValidationErrors}
                isLoading={submitting}
                className={submitButtonClassName}
              />
            )}
          </div>
          {needGoogleAuth && (
            <>
              <div className="common__or auth__separator">OR</div>
              <div className="auth__googleButton-wrapper">
                <GoogleLoginForm
                  onSubmit={onSubmit}
                  width={isMobile ? 350 : 400}
                  text={'signup_with'}
                />
              </div>
            </>
          )}
          {isShowFooter && (
            <>
              <hr className="auth__hr" />
              <div className="auth__check-account">
                Have an account?&nbsp;
                <div className="auth__link" onClick={onSignInClick || navigateToSignIn}>
                  Sign In
                </div>
              </div>
            </>
          )}
        </form>
      )}
    />
  );
}

export default SignUpForm;
