import classNames from 'classnames';
import UIButton from 'Components/UIComponents/UIButton';
import UITextInput from 'Components/UIComponents/UITextInput';
import React, { useCallback, useMemo, useState } from 'react';
import MaskedInput from 'react-text-mask';

interface CodeInputProps {
  onUpgrade: (code: string) => void;
  onChange?: (v: string) => void;
  value?: string;
  buttonTitle?: string;
  placeholder?: string;
  succeeded?: boolean;
  failure?: boolean;
  isLoading?: boolean;
  inputClassName?: string;
  buttonClassName?: string;
}

const CodeInput = ({
  onUpgrade,
  onChange,
  value,
  buttonTitle = 'Upgrade',
  placeholder = 'E N T E R  C O D E',
  succeeded,
  failure,
  isLoading,
  inputClassName,
  buttonClassName,
}: CodeInputProps) => {
  const [code, setCode] = useState<string>(value || '');

  const handleUpgrade = useCallback(() => {
    if (!code) return;

    onUpgrade(code);
  }, [code, onUpgrade]);

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value);
      }

      setCode(event.target.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const mask = useMemo(() => new Array(32).fill(/[\w]/), []);

  return (
    <div className="billing__appSumo-inputWrapper">
      <MaskedInput
        mask={mask}
        onChange={handleValueChange}
        guide={false}
        render={(ref, maskedProps) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (
            <UITextInput
              placeholder={placeholder}
              value={code}
              wrapperClassName="billing__appSumo-inputContainer"
              inputClassName={classNames(
                'billing__appSumo-input',
                {
                  succeeded,
                  failure,
                },
                inputClassName,
              )}
              {...maskedProps}
              ref={ref}
            />
          );
        }}
      />
      <UIButton
        title={buttonTitle}
        handleClick={handleUpgrade}
        isLoading={isLoading}
        disabled={(!code && !value) || isLoading}
        className={classNames(
          'billing__appSumo-button',
          { succeeded, failure },
          buttonClassName,
        )}
        priority="primary"
      />
    </div>
  );
};

export default CodeInput;
