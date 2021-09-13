import UIButton from 'Components/UIComponents/UIButton';
import UIModal from 'Components/UIComponents/UIModal';
import UITextInput from 'Components/UIComponents/UITextInput';
import React, { useCallback, useState } from 'react';

interface ConfirmCodeModalProps {
  onClose: () => void;
  sendCode: (code: string) => void;
  isSending?: boolean;
  title: string;
  subtitle?: string;
  resendCode?: () => void;
  codeLength?: number;
}

const ConfirmCodeModal = ({
  sendCode,
  isSending,
  title,
  subtitle,
  resendCode,
  onClose,
  codeLength,
}: ConfirmCodeModalProps) => {
  const [codeAccess, setCodeAccess] = useState<string>('');

  const handleCodeAccessChange = useCallback(event => {
    setCodeAccess(event.target.value);
  }, []);

  const handleCodeAccessSend = useCallback(() => {
    sendCode(codeAccess);
  }, [codeAccess, sendCode]);

  const handleResendCode = useCallback(() => {
    return resendCode && resendCode();
  }, [resendCode]);

  return (
    <UIModal onClose={() => onClose()} className="confirmCodeModal" hideCloseIcon>
      <div className="confirmCodeModal__wrapper">
        <div className="confirmCodeModal__title">{title}</div>
        {subtitle && <div className="confirmCodeModal__subtitle">{subtitle}</div>}
        <div className="confirmCodeModal__field">
          <UITextInput
            type="password"
            onChange={handleCodeAccessChange}
            value={codeAccess}
            placeholder="0A2b3C4d5E"
          />
          {resendCode && (
            <UIButton
              handleClick={handleResendCode}
              title="Resend"
              priority="secondary"
              disabled={isSending}
              isLoading={isSending}
            />
          )}
        </div>
        <div className="confirmCodeModal__submit">
          <UIButton
            handleClick={handleCodeAccessSend}
            title="Send"
            priority="primary"
            disabled={isSending || !!(codeLength && codeAccess.length !== codeLength)}
            isLoading={isSending}
          />
        </div>
      </div>
    </UIModal>
  );
};

export default ConfirmCodeModal;
