import React from 'react';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { UITextFieldProps } from './interfaces/UITextField';

export type UITextInputProps = UITextFieldProps<HTMLInputElement> & {
  wrapperClassName?: string;
  inputClassName?: string;
  onIconFocus?: (state: boolean) => void;
  iconFocusState?: boolean;
};

function UITextInput(props: UITextInputProps, ref) {
  const {
    onBlur,
    onFocus,
    onChange,
    onKeyUp,
    onKeyDown,
    value,
    placeholder,
    error,
    required,
    type = 'text',
    icon,
    min,
    autofocus = false,
    disabled = false,
    hidden,
    wrapperClassName,
    inputClassName,
    readOnly,
    onIconFocus,
    iconFocusState,
    autoComplete,
  } = props;

  return (
    <div className={classNames('form__input-wrapper', wrapperClassName)}>
      <input
        type={type}
        autoComplete={autoComplete}
        className={classNames(inputClassName, {
          form__input: !hidden,
          'form__input--error': error,
          'form__input--withIcon': icon,
          'form__input--hidden': hidden,
        })}
        ref={ref}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        min={min}
        autoFocus={autofocus}
        disabled={disabled}
        readOnly={readOnly}
      />
      {icon && (
        <ReactSVG
          src={icon}
          onMouseEnter={() => onIconFocus && onIconFocus(true)}
          onMouseLeave={() => onIconFocus && onIconFocus(false)}
          onClick={() => onIconFocus && onIconFocus(!iconFocusState)}
          className="form__input-icon"
        />
      )}
    </div>
  );
}

export default React.forwardRef(UITextInput);
