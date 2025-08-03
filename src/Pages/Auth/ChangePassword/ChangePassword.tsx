import React, { useCallback, useMemo, useEffect } from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FieldTextInput from 'Components/FormFields/FieldTextInput';
import UIButton from 'Components/UIComponents/UIButton';
import { required, confirmPassword, password } from 'Utils/validation';
import { PasswordChangeData } from 'Interfaces/Auth';
import { composeValidators } from 'Utils/functions';
import { RouteChildrenProps } from 'react-router-dom';
import History from 'Services/History';
import { usePasswordChange, usePasswordChangeToken } from 'Hooks/Auth';
import Toast from 'Services/Toast';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

function ChangePassword({ location }: RouteChildrenProps) {
  const [setToken, clearToken] = usePasswordChangeToken();
  const [changePassword] = usePasswordChange();
  const passwordToken = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    return searchParams.get('passwordResetToken');
  }, [location.search]);

  const navigateToRoot = useCallback(() => {
    History.replace(AuthorizedRoutePaths.BASE_PATH);
  }, []);

  const handleSubmit = useCallback(
    async (values: PasswordChangeData) => {
      try {
        await changePassword(values);
        Toast.success('Password successfully changed');
        navigateToRoot();
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [changePassword, navigateToRoot],
  );

  useEffect(() => {
    if (!passwordToken) {
      return navigateToRoot();
    }

    setToken({ token: passwordToken });

    return () => clearToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateToRoot, passwordToken]);

  return (
    <div className="auth">
      <h1 className="auth__title">Change Password</h1>
      <p className="auth__description">Please enter new password.</p>
      <Form
        onSubmit={handleSubmit}
        mutators={{ ...arrayMutators }}
        render={({
          handleSubmit,
          submitting,
          pristine,
          hasValidationErrors,
        }: FormRenderProps<PasswordChangeData>) => (
          <form className="auth__form auth__form--border">
            <Field
              name="password"
              label="New Password"
              placeholder="Password"
              type="password"
              component={FieldTextInput}
              validate={composeValidators<string>(required, password)}
            />
            <Field
              name="passwordConfirmation"
              label="Repeat new Password"
              placeholder="Repeat Password"
              type="password"
              component={FieldTextInput}
              validate={composeValidators<string>(required, confirmPassword)}
            />
            <div className="auth__submitButton">
              <UIButton
                priority="primary"
                title="Change password"
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

export default ChangePassword;
