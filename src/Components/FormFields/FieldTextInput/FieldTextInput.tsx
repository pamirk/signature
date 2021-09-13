import React from 'react';
import UITextInput from 'Components/UIComponents/UITextInput';
import { FieldInput } from '../FieldInput';
import { FieldRenderProps } from 'react-final-form';

const FieldTextInput = (props: FieldRenderProps<string>) => (
  <FieldInput {...props} renderInput={props => <UITextInput {...props} />} />
);

export default FieldTextInput;
