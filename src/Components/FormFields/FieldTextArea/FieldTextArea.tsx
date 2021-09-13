import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import UITextArea from 'Components/UIComponents/UITextArea';
import FieldInput from '../FieldInput';

const FieldTextArea = (props: FieldRenderProps<string>) => (
  <FieldInput {...props} renderInput={props => <UITextArea {...props} />} />
);

export default FieldTextArea;
