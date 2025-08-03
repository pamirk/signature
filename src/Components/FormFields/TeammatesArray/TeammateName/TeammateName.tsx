import CircleClose from 'Assets/images/icons/circle-close.svg';
import FormError from 'Components/UIComponents/FormError';
import UITextInput from 'Components/UIComponents/UITextInput';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { ReactSVG } from 'react-svg';

interface TeammateNameProps extends FieldRenderProps<string> {
  isDeletable?: boolean;
  onDelete?: () => void;
}

const TeammateName = ({ input, meta, isDeletable, onDelete }: TeammateNameProps) => {
  const { error, touched, submitError, dirtySinceLastSubmit } = meta;
  const isError = (error && touched) || (submitError && !dirtySinceLastSubmit);
  const isMobile = useIsMobile();

  return (
    <div className={classNames('teammates__name-wrapper', { mobile: isMobile })}>
      <div className="teammates__name-inner">
        <UITextInput {...input} placeholder="Name" error={isError} />
        {isDeletable && (
          <ReactSVG
            src={CircleClose}
            className="teammates__name-remove"
            onClick={onDelete}
          />
        )}
      </div>
      <div className="teammates__name-error">{isError && <FormError meta={meta} />}</div>
    </div>
  );
};

export default TeammateName;
