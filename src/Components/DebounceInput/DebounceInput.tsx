import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import UITextInput from 'Components/UIComponents/UITextInput';

interface DebounceInputProps {
  placeholder: string;
  onChange: (value) => void;
  icon?: string;
}

const DebounceInput = ({ placeholder, onChange, icon }: DebounceInputProps) => {
  const [value, setValue] = useState('');

  const debouncedOnChange = useMemo(() => debounce(onChange, 1000), [onChange]);

  const handleChangeValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      debouncedOnChange(event.target.value.trim());
    },
    [debouncedOnChange],
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
