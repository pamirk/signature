import UIButton from 'Components/UIComponents/UIButton';
import UITextInput from 'Components/UIComponents/UITextInput';
import React, { useCallback, useState } from 'react';
import MaskedInput from 'react-text-mask';

interface CodeInputProps {
  onUpgrade: (code: string) => void;
  isLoading?: boolean;
}

const CodeInput = ({ onUpgrade, isLoading }: CodeInputProps) => {
  const [code, setCode] = useState<string>();

  const handleUpgrade = useCallback(() => {
    if (!code) return;

    onUpgrade(code);
  }, [code, onUpgrade]);

  const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  }, []);

  return (
    <div className="billing__appSumo-inputWrapper">
      <MaskedInput
        mask={[
          /[\w]/,
          /[\w]/,
          /[\w]/,
          /[\w]/,
          /[\w]/,
          /[\w]/,
          /[\w]/,
          /[\w]/,
          /[\w]/,
          /[\w]/,
        ]}
        onChange={handleValueChange}
        guide={false}
        render={(ref, maskedProps) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (
            <UITextInput
              placeholder="E N T E R  C O D E"
              wrapperClassName="billing__appSumo-inputContainer"
              inputClassName="billing__appSumo-input"
              {...maskedProps}
              ref={ref}
            />
          );
        }}
      />
      <UIButton
        title="Upgrade"
        handleClick={handleUpgrade}
        disabled={!code && !isLoading}
        className="billing__appSumo-button"
        priority="primary"
      />
    </div>
  );
};

export default CodeInput;
