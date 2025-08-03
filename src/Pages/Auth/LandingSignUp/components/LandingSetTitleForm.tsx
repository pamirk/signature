import React from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { FieldTextInput } from 'Components/FormFields';
import { composeValidators } from 'Utils/functions';
import {
  maxLength100,
  notOnlySpaces,
  required,
  titleNotUrlProtocol,
} from 'Utils/validation';
import UIButton from 'Components/UIComponents/UIButton';

interface LandingSetTitleFormProps {
  buttonTitle?: string;
  isLoading?: boolean;
}

const LandingSetTitleForm = ({
  buttonTitle = 'Sign Document',
  isLoading,
}: LandingSetTitleFormProps) => {
  return (
    <div className={classNames('sign-up-landing__upload-wrapper')}>
      <p className="sign-up-landing__upload-header">One more thing</p>
      <Field
        name="title"
        label="Document title"
        component={FieldTextInput}
        placeholder="Enter the title"
        validate={composeValidators<string>(
          required,
          notOnlySpaces,
          maxLength100,
          titleNotUrlProtocol,
        )}
      />
      <UIButton
        priority="primary"
        title={buttonTitle}
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
      />
    </div>
  );
};

export default LandingSetTitleForm;
