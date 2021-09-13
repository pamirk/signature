import React from 'react';
import classNames from 'classnames';
import { UITextFieldProps } from './interfaces/UITextField';

interface UITextAreaProps extends UITextFieldProps {
  maxLength?: number;
  height?: string | number;
  className?: string;
}

function UITextArea(
  {
    onBlur,
    onFocus,
    onChange,
    value,
    error,
    placeholder,
    height = 110,
    maxLength,
    disabled = false,
    className,
  }: UITextAreaProps,
  ref:any,
) {
  return (
    <textarea
      className={classNames('form__input form__input--textArea', className, {
        'form__input--error': error,
      })}
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onBlur={onBlur}
      onFocus={onFocus}
      style={{ height: height }}
      maxLength={maxLength && maxLength}
      disabled={disabled}
    />
  );
}

export default React.forwardRef(UITextArea);
