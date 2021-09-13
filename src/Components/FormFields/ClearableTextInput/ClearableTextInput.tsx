import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FieldTextInput } from '..';

export interface ClearableTextInput extends FieldRenderProps<string> {
  inputComponent?: React.FunctionComponent;
}

const ClearableTextInput = ({
  inputComponent: InputComponent = FieldTextInput,
  ...fieldProps
}: FieldRenderProps<string>) => {
  const handleFocus = useCallback(() => {
    fieldProps.input.onChange(undefined);
  }, [fieldProps.input]);

  return (
    <InputComponent
      {...fieldProps}
      input={{ ...fieldProps.input, onFocus: handleFocus }}
    />
  );
};

export default ClearableTextInput;
