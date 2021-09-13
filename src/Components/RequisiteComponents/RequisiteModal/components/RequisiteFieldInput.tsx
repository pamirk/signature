import React, { useState, useMemo } from 'react';
import { UITextFieldProps } from 'Components/UIComponents/interfaces/UITextField';
import { FieldTextInput } from 'Components/FormFields';

interface RequisiteFieldInputProps extends UITextFieldProps {
  label: string;
  name?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
}

const RequisiteFieldInput = ({
  value = '',
  label,
  name = '',
  labelClassName,
  isRequired = false,
  onChange = () => {},
  ...props
}: RequisiteFieldInputProps) => {
  const [active, setActive] = useState(false);
  const [touched, setTouched] = useState(false);
  const [left, setLeft] = useState(false);
  const visited = useMemo(() => touched && left, [left, touched]);
  const error = isRequired && visited && !(isRequired && value) ? 'Required' : '';
  const onFocus = () => {
    !touched && setTouched(true);
    setActive(true);
  };
  const onBlur = () => {
    !left && setLeft(true);
    setActive(false);
  };

  return (
    <FieldTextInput
      input={{ name, onFocus, onBlur, onChange, value: value as string }}
      meta={{ error, active, touched, visited }}
      label={
        <label className={labelClassName}>
          {label} {isRequired && <span className={`${labelClassName}--required`}>*</span>}
        </label>
      }
      {...props}
    />
  );
};

export default RequisiteFieldInput;
