import React from 'react';
import { FieldRenderProps } from 'react-final-form';

export interface FormErrorProps {
  meta: FieldRenderProps<any>['meta'];
}

function FormError({ meta: { error, submitError } }: FormErrorProps) {
  const inputErrors = error || submitError;

  return (
    <div className="form__error-wrapper">
      {Array.isArray(inputErrors) ? (
        inputErrors.map((item, index) => (
          <p key={index.toString()} className="form__error">
            {item}
          </p>
        ))
      ) : (
        <p className="form__error">{inputErrors}</p>
      )}
    </div>
  );
}

export default FormError;
