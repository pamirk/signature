import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';
import UICheckbox, { UICheckboxProps } from 'Components/UIComponents/UICheckbox';
import { InteractExtraValues } from 'Interfaces/Document';

interface FieldCheckboxProps extends UICheckboxProps, FieldRenderProps<boolean> {
  className?: string;
  onClick?: (values: InteractExtraValues) => void;
}

const FieldCheckbox = ({
  input,
  className,
  onClick,
  ...checkboxProps
}: FieldCheckboxProps) => {
  const handleClick = useCallback(() => {
    input.onChange(!input.value);
    if (onClick) onClick({ isOrdered: !input.value });
  }, [input, onClick]);

  return (
    <div className={className}>
      <UICheckbox {...checkboxProps} check={input.value} handleClick={handleClick} />
    </div>
  );
};

export default FieldCheckbox;
