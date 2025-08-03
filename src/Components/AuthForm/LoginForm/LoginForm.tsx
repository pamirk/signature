import React, { useCallback } from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import FieldTextInput from 'Components/FormFields/FieldTextInput';
import UIButton from 'Components/UIComponents/UIButton';
import { required, email } from 'Utils/validation';
import { AuthData } from 'Interfaces/Auth';
import { composeValidators } from 'Utils/functions';
import FieldPasswordInput from 'Components/FormFields/FieldPasswordInput';
import UISpinner from 'Components/UIComponents/UISpinner';
import GoogleLoginForm from '../GoogleLoginForm';
import { toLowerCaseAndRemoveEmptyCharacters } from 'Utils/formatters';
import History from 'Services/History';
import { AuthFormProps } from '../interfaces/AuthFormProps';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface LoginFormProps extends AuthFormProps {
  onSignUpClick?: () => void;
  formClassName?: string;
}

function LoginForm({
  onSubmit,
  isLoading,
  formClassName,
  onSignUpClick,
}: LoginFormProps) {
  const navigateToSignUp = useCallback(
    () => History.push(UnauthorizedRoutePaths.SIGN_UP),
    [],
  );

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      render={({
        handleSubmit,
        submitting,
        pristine,
        hasValidationErrors,
      }: FormRenderProps<AuthData>) => {
        return (
          <form
            className={classNames(
              'auth__form auth__form--login auth__form--border',
              formClassName,
            )}
          >
            <Field
              name="email"
              label="Email Address"
              component={FieldTextInput}
              parse={toLowerCaseAndRemoveEmptyCharacters}
              placeholder="username@gmail.com"
              validate={composeValidators<string>(required, email)}
            />
            <div className="auth__field auth__field--password">
              <Field
                name="password"
                label="Password"
                type="password"
                component={FieldPasswordInput}
                validate={required}
                placeholder="Your password"
              />
              <div className="auth__forgot">
                <div
                  className="auth__link"
                  onClick={() => {
                    History.push(UnauthorizedRoutePaths.RESET);
                  }}
                >
                  Forgot password?
                </div>
              </div>
            </div>
            <div className="auth__submitButton">
              {isLoading ? (
                <UISpinner
                  width={40}
                  height={40}
                  wrapperClassName="spinner--main__wrapper"
                />
              ) : (
                <UIButton
                  priority="primary"
                  title="Login"
                  handleClick={handleSubmit}
                  type="submit"
                  disabled={pristine || submitting || hasValidationErrors}
                  isLoading={submitting}
                />
              )}
            </div>
            <div className="common__or">OR</div>
            <div className="auth__googleButton-wrapper">
              <GoogleLoginForm onSubmit={onSubmit} width={300} text={'signin_with'} />
            </div>
            <hr className="auth__hr" />
            <div className="auth__check-account">
              Don’t have an account?&nbsp;
              <div className="auth__link" onClick={onSignUpClick || navigateToSignUp}>
                Sign Up
              </div>
            </div>
          </form>
        );
      }}
    />
  );
}

export default LoginForm;
