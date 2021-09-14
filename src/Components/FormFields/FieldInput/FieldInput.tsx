import React, { useCallback } from 'react';
import classNames from 'classnames';
import FormError from 'Components/UIComponents/FormError';
import { FieldRenderProps } from 'react-final-form';
interface RenderFieldInputProps extends FieldRenderProps<string | number> {
  renderInput: (inputProps) => React.ReactNode;
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
    ...componentProps
  } = props;
  const { error, submitError, touched, dirtySinceLastSubmit } = meta;
  const isError = (error && touched) || (submitError && !dirtySinceLastSubmit);

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
      {label && <label className="form__label">{label}</label>}
      {renderInput({
        ...componentProps,
        ...input,
        error: isError,
        onBlur: handleBlur,
        onFocus: handleFocus,
      })}
      {isError && <FormError meta={meta} />}
    </div>
  );
}

export default FieldInput;
