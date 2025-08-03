import CircleClose from 'Assets/images/icons/circle-close.svg';
import FormError from 'Components/UIComponents/FormError';
import UITextInput from 'Components/UIComponents/UITextInput';
import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { ReactSVG } from 'react-svg';

interface TeammateEmailProps extends FieldRenderProps<string> {
  isDeletable?: boolean;
  onDelete?: () => void;
}

const TeammateEmail = ({ input, meta, isDeletable, onDelete }: TeammateEmailProps) => {
  const { error, touched, submitError, dirtySinceLastSubmit } = meta;
  const isError = (error && touched) || (submitError && !dirtySinceLastSubmit);

  return (
    <div className="teammates__email">
      <div className="teammates__email-inner">
        <UITextInput {...input} placeholder="test@signaturely.com" error={isError} />
        {isDeletable && (
          <ReactSVG src={CircleClose} className="teammates__remove" onClick={onDelete} />
        )}
      </div>
      <div className="teammates__email-error">{isError && <FormError meta={meta} />}</div>
    </div>
  );
};

export default TeammateEmail;
