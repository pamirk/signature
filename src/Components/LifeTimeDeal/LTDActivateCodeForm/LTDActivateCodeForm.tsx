import React from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FieldTextInput from 'Components/FormFields/FieldTextInput';
import UIButton from 'Components/UIComponents/UIButton';
import { required } from 'Utils/validation';
import UISpinner from 'Components/UIComponents/UISpinner';
import { LtdCodePayload } from 'Interfaces/Billing';
import { OnSubmitReturnType } from 'Interfaces/FinalForm';

interface LTDActivateCodeFormProps {
  onSubmit: (values: LtdCodePayload) => OnSubmitReturnType;
  isLoading?: boolean;
  isShowFooter?: boolean;
  submitButtonClassName?: string;
  fieldClassName?: string;
}

function LTDActivateCodeForm({
  onSubmit,
  isLoading,
  fieldClassName,
  submitButtonClassName,
}: LTDActivateCodeFormProps) {
  return (
    <Form
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      render={({
        handleSubmit,
        submitting,
        pristine,
        hasValidationErrors,
      }: FormRenderProps<LtdCodePayload>) => (
        <form className="auth__form auth__form--signup">
          <Field
            name="code"
            label="License Key"
            className={fieldClassName}
            component={FieldTextInput}
            placeholder="Enter your license key here"
            validate={required}
          />
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
                title="Continue"
                handleClick={handleSubmit}
                type="submit"
                disabled={pristine || submitting || hasValidationErrors}
                isLoading={submitting}
                className={submitButtonClassName}
              />
            )}
          </div>
        </form>
      )}
    />
  );
}

export default LTDActivateCodeForm;
