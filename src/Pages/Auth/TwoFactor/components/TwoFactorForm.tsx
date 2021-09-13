import React, { useMemo } from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FieldTextInput from 'Components/FormFields/FieldTextInput';
import UIButton from 'Components/UIComponents/UIButton';
import { OnSubmitReturnType } from 'Interfaces/FinalForm';
import UISpinner from 'Components/UIComponents/UISpinner';
import classnames from 'classnames';
import { CodePayload } from 'Interfaces/Profile';
import { TwoFactorTypes } from 'Interfaces/Auth';
import useIsMobile from 'Hooks/Common/useIsMobile';

type TwoFactorFormValues = CodePayload & { twoFactorType?: TwoFactorFormValues };

interface TwoFactorFormProps {
  onSubmit: (values: TwoFactorFormValues) => OnSubmitReturnType;
  isLoading?: boolean;
  formClassName?: string;
  twoFactorType?: TwoFactorTypes;
  title?: string;
  imageSrc?: string;
}

function TwoFactorForm({
  onSubmit,
  isLoading,
  formClassName,
  twoFactorType,
  title,
  imageSrc,
}: TwoFactorFormProps) {
  const isMobile = useIsMobile();
  const { type, description, header, placeholder } = useMemo(
    () =>
      twoFactorType === TwoFactorTypes.TWILLIO
        ? {
            placeholder: '1234',
            header: 'SMS 2-Factor Authentication',
            type: 'SMS',
            description:
              'An SMS with a verification code was sent to the number indicated in the profile.',
          }
        : {
            placeholder: '1235678',
            header: 'Google Authenticator 2-Factor',
            type: 'Google Authenticator',
            description:
              'Type in the code from your Google Authenticator application on your device',
          },
    [twoFactorType],
  );

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ twoFactorType } as TwoFactorFormValues}
      mutators={{ ...arrayMutators }}
      render={({
        form,
        handleSubmit,
        submitting,
        pristine,
        hasValidationErrors,
      }: FormRenderProps<TwoFactorFormValues>) => {
        return (
          <div className="twoFactor">
            <h1 className="twoFactor__title">{header}</h1>
            <form
              className={classnames(
                'twoFactor__form twoFactor__form--border',
                formClassName,
                { mobile: isMobile },
              )}
              onSubmit={handleSubmit}
            >
              <div className="title">
                {title || `To confirm this action, enter the code from ${type}`}
              </div>
              {imageSrc && <img src={imageSrc} />}
              <div className="subtitle">{description}</div>
              <Field name="code" component={FieldTextInput} placeholder={placeholder} />
              <div className="twoFactor__submitButton">
                {submitting ? (
                  <UISpinner
                    width={40}
                    height={40}
                    wrapperClassName="spinner--main__wrapper"
                  />
                ) : (
                  <UIButton
                    priority="primary"
                    title="Confirm"
                    handleClick={handleSubmit}
                    type="submit"
                    disabled={pristine || hasValidationErrors || isLoading}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </form>
          </div>
        );
      }}
    />
  );
}

export default TwoFactorForm;
