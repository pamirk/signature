import React, { useCallback, useState } from 'react';
import lodash from 'lodash';
import UITextInput from 'Components/UIComponents/UITextInput';

interface DebounceInputProps {
  placeholder: string;
  onChange: (value) => void;
  icon?: string;
}

const debounce = lodash.debounce((func, value) => {
  func(value);
}, 1000);

const DebounceInput = ({ placeholder, onChange, icon }: DebounceInputProps) => {
  const [value, setValue] = useState('');

  const handleChangeValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      debounce(onChange, event.target.value);
    },
    [onChange],
  );

  return (
    <UITextInput
      placeholder={placeholder}
      value={value}
      onChange={handleChangeValue}
      icon={icon}
    />
  );
};

export default DebounceInput;
