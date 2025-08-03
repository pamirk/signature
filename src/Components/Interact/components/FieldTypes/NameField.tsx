import React, { CSSProperties, useCallback, useRef } from 'react';
import classNames from 'classnames';
import { FieldColorNames } from 'Hooks/DocumentFields/useDocumentFieldColor';
import { DocumentField } from 'Interfaces/DocumentFields';
import NameIcon from 'Assets/images/icons/name-icon.svg';
import { DatePipeOptions } from 'Interfaces/Common';
import { ReactSVG } from 'react-svg';
import { Signer } from 'Interfaces/Document';

interface NameFieldProps {
  onFieldDataChange?: (fieldData: Partial<DocumentField>) => void;
  signer?: Signer;
  value?: string | null;
  style?: CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  isInsertable?: boolean;
  fieldColor?: FieldColorNames;
  datePipeOptions?: DatePipeOptions;
}

export const NameField = ({
  value,
  signer,
  onFieldDataChange,
  style,
  onFocus,
  onBlur,
  fieldColor,
  disabled,
  isInsertable,
}: NameFieldProps) => {
  const shadowRef = useRef<HTMLSpanElement>(null);

  const changeTextValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onFieldDataChange) {
        const { value } = event.target;

        return onFieldDataChange({
          text: value,
        });
      }
    },
    [onFieldDataChange],
  );

  const placeholder = signer?.isPreparer
    ? 'Your name'
    : signer?.name ??
      (signer?.role
        ? `${signer.role + (signer.role.endsWith('s') ? "'" : "'s")} name`
        : 'Name');

  return (
    <div
      style={style}
      className={classNames('fieldDropDown__trigger-name', `fieldColor__${fieldColor}`, {
        'fieldDropDown__trigger--disabled': disabled,
        disabled_pointer_event: disabled || !isInsertable,
      })}
    >
      <span
        ref={shadowRef}
        className="fieldDropDown__trigger-name-content fieldDropDown__trigger-name-shadow"
      >
        {value || placeholder}
      </span>
      <input
        onFocus={onFocus}
        onBlur={onBlur}
        type="text"
        className={classNames(
          'fieldDropDown__trigger-name-content',
          'fieldDropDown__trigger-name-input',
          {
            'fieldDropDown__trigger--disabled': disabled,
          },
        )}
        placeholder={placeholder}
        value={value || ''}
        onChange={changeTextValue}
        disabled={disabled || !isInsertable}
      />
      <ReactSVG src={NameIcon} className="fieldDropDown__trigger-name-icon" />
    </div>
  );
};

export default NameField;
