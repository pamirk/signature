import React from 'react';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { FieldColorNames } from 'Hooks/DocumentFields/useDocumentFieldColor';

// @ts-ignore
import ArrowCheck from 'Assets/images/icons/checkbox-arrow-document.svg';

interface CheckboxFieldProps {
  disabled?: boolean;
  checked?: boolean;
  fieldColor?: FieldColorNames;
}

const CheckboxField = ({ disabled, checked, fieldColor }: CheckboxFieldProps) => {
  return (
    <div
      className={classNames(
        'fieldDropDown__trigger-checkbox',
        `fieldColor__${fieldColor}`,
        {
          'fieldDropDown__trigger--disabled': disabled,
        },
      )}
    >
      {checked && (
        <ReactSVG src={ArrowCheck} className="fieldDropDown__trigger--checkbox-mark" />
      )}
    </div>
  );
};

export default CheckboxField;
