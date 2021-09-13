import React from 'react';
import FieldTextInput from 'Components/FormFields/FieldTextInput';
import { Form, Field } from 'react-final-form';
import { required, maxLength100, notOnlySpaces } from 'Utils/validation';
import { OnSubmitReturnType } from 'Interfaces/FinalForm';
import { composeValidators } from 'Utils/functions';

interface RenameTitleFormProps {
  documentTitle: string;
  onSubmit: ({ title: string }:any) => OnSubmitReturnType;
}
const EditableTitle = ({ documentTitle, onSubmit }: RenameTitleFormProps) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ title: documentTitle }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="title"
            component={FieldTextInput}
            autofocus
            hidden
            validate={composeValidators<string>(required, notOnlySpaces, maxLength100)}
          />
        </form>
      )}
    />
  );
};
export default EditableTitle;
