import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { useToggler } from 'Hooks/Common';
import EyeIcon from 'Assets/images/icons/eye.svg';
import CrossedEyeIcon from 'Assets/images/icons/crossed-eye.svg';
import { FieldInput } from '../FieldInput';
import UITextInput from 'Components/UIComponents/UITextInput';
import { ReactSVG } from 'react-svg';

function FieldPasswordInput(props: FieldRenderProps<string>) {
  const [isVisible, toggle] = useToggler(false);
  const type = isVisible ? 'text' : 'password';
  const currentIcon = isVisible ? EyeIcon : CrossedEyeIcon;

  return (
    <FieldInput
      {...props}
      renderInput={inputProps => (
        <div className="form__input-wrapper--password">
          <UITextInput {...inputProps} type={type} />
          <ReactSVG
            src={currentIcon}
            onClick={toggle}
            className="form__input-icon form__input-icon--password"
          />
        </div>
      )}
    />
  );
}

export default FieldPasswordInput;
