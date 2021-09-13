import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';
import UISelect, { UISelectProps } from 'Components/UIComponents/UISelect';
import FieldInput from '../FieldInput';

interface FieldSelectProps
  extends UISelectProps<string | number>,
    FieldRenderProps<string | number> {
  className?: string;
  isClearable?: boolean;
}

const FieldSelect = ({ className, isClearable, ...restProps }: FieldSelectProps) => {
  const handleSelect = useCallback(
    value => {
      restProps.input.onChange(value);
    },
    [restProps.input],
  );

  return (
    <div className={className}>
      <FieldInput
        {...restProps}
        renderInput={inputProps => (
          <UISelect
            {...inputProps}
            handleSelect={handleSelect}
            isClearable={!!inputProps.value && isClearable}
          />
        )}
      />
    </div>
  );
};

export default FieldSelect;
