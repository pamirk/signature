import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { ReactSVG } from 'react-svg';
import CircleClose from 'Assets/images/icons/circle-close.svg';
import UITextInput from 'Components/UIComponents/UITextInput';
import FormError from 'Components/UIComponents/FormError';

interface RecipientEmailProps extends FieldRenderProps<string> {
  isDeletable?: boolean;
  onDelete?: () => void;
}

const RecipientEmail = ({ input, meta, isDeletable, onDelete }: RecipientEmailProps) => {
  const { error, touched, submitError, dirtySinceLastSubmit } = meta;
  const isError = (error && touched) || (submitError && !dirtySinceLastSubmit);

  return (
    <li className="emailRecipients__item">
      <div className="emailRecipients__item-inner">
        <UITextInput {...input} placeholder="test@signaturely.com" error={isError} />
        {isDeletable && (
          <ReactSVG
            src={CircleClose}
            className="emailRecipients__remove"
            onClick={onDelete}
          />
        )}
      </div>
      {isError && <FormError meta={meta} />}
    </li>
  );
};

export default RecipientEmail;
