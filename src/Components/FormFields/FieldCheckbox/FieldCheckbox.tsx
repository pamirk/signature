import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';
import UICheckbox, { UICheckboxProps } from 'Components/UIComponents/UICheckbox';

interface FieldCheckboxProps extends UICheckboxProps, FieldRenderProps<boolean> {
  className?: string;
}

const FieldCheckbox = ({ input, className, ...checkboxProps }: FieldCheckboxProps) => {
  const handleClick = useCallback(() => {
    input.onChange(!input.value);
  }, [input]);

  return (
    <div className={className}>
      <UICheckbox {...checkboxProps} check={input.value} handleClick={handleClick} />
    </div>
  );
};

export default FieldCheckbox;
