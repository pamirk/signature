import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import FormError from 'Components/UIComponents/FormError';
import { FieldRenderProps } from 'react-final-form';
import ErrorIcon from 'Assets/images/icons/error.svg';
import { TooltipBlock } from 'Components/Tooltip';

interface RenderFieldInputProps extends FieldRenderProps<string | number> {
  renderInput: (inputProps) => React.ReactNode;
  labelClassName?: string;
}

function FieldInput(props: RenderFieldInputProps) {
  const {
    input,
    meta,
    onBlur,
    onFocus,
    label,
    className,
    renderInput,
    labelClassName,
    ...componentProps
  } = props;
  const { error, submitError, touched, dirtySinceLastSubmit } = meta;
  const isError = (!!error && touched) || (!!submitError && !dirtySinceLastSubmit);

  const [isFocusedError, setFocusedError] = useState<boolean>(false);

  const handleBlur = useCallback(() => {
    input.onBlur();
    if (onBlur) onBlur();
  }, [input, onBlur]);

  const handleFocus = useCallback(() => {
    input.onFocus();
    if (onFocus) onFocus();
  }, [input, onFocus]);

  return (
    <div className={classNames({ form__field: !componentProps.hidden }, className)}>
      {label && (
        <label className={classNames('form__label', labelClassName)}>{label}</label>
      )}
      {renderInput({
        ...componentProps,
        ...input,
        error: isError,
        onBlur: handleBlur,
        onFocus: handleFocus,
        icon: isError ? ErrorIcon : undefined,
        onIconFocus: (state: boolean) => setFocusedError(state),
        iconFocusState: isFocusedError,
      })}
      {isError && isFocusedError && (
        <TooltipBlock className="form__tooltip" disabledMobile={true}>
          <FormError meta={meta} />
        </TooltipBlock>
      )}
    </div>
  );
}

export default FieldInput;
