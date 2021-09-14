import React from 'react';
import FieldInput from '../FieldInput';
import UITextInput, { UITextInputProps } from 'Components/UIComponents/UITextInput';
import MaskedInput, { MaskedInputProps } from 'react-text-mask';
import { FieldRenderProps } from 'react-final-form';

export interface MaskedTextInputProps extends FieldRenderProps<string> {
  maskedInputProps: MaskedInputProps & Required<Pick<MaskedInputProps, 'mask'>>;
}

const MaskedTextInput = ({ ...fieldProps }: FieldRenderProps<string>) => {
  return (
    <FieldInput
      {...fieldProps}
      renderInput={(inputProps: UITextInputProps) => (
        <MaskedInput
          guide={false}
          {...inputProps}
          render={(ref, maskedProps) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { value, ...restInput } = inputProps;
            return <UITextInput {...restInput} {...maskedProps} ref={ref} />;
          }}
        />
      )}
    />
  );
};

export default MaskedTextInput;
