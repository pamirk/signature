import React from 'react';
import { Form } from 'react-final-form';
import { UpdateEmailPayload } from 'Interfaces/Profile';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import ChangeEmailFields from './ChangeEmailFields';
import useEmailUpdate from 'Hooks/User/useEmailUpdate';
import Toast from 'Services/Toast';

export interface ChangeEmailFormFieldProps {
  isUser: boolean;
}

const ChangeEmailForm = ({ isUser }: ChangeEmailFormFieldProps) => {
  const { email } = useSelector(selectUser);
  const [updateEmail, isEmailUpdating] = useEmailUpdate();

  const handleUpdateEmail = async (values: UpdateEmailPayload) => {
    try {
      await updateEmail(values);

      Toast.success('Check your new email to confirm it');
    } catch (err) {
      Toast.handleErrors(err);
    }
  };

  return (
    <Form
      keepDirtyOnReinitialize
      initialValues={{ email: email as string }}
      onSubmit={handleUpdateEmail}
      render={({ handleSubmit, submitting, hasValidationErrors, pristine, values }) => (
        <ChangeEmailFields
          handleSubmit={handleSubmit}
          isDisabled={pristine || submitting || hasValidationErrors || isEmailUpdating}
          isFieldDisabled={isUser}
          emailValue={values.email}
        />
      )}
    />
  );
};

export default ChangeEmailForm;
