import React, { useCallback, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { REACT_APP_GOOGLE_RECAPTCHA_SITEKEY } from 'Utils/constants';
import UIButton from '../../../../Components/UIComponents/UIButton';
import { CodeScopeType } from '../../../../Interfaces/Profile';

export interface PhoneVerificationUnsubscribeProps {
  phoneNumber?: string | null;
  handleCodeGenerate: (
    param: { phone: string; recaptcha: string },
    scope: CodeScopeType,
  ) => void;
  isLoading: boolean;
}

const PhoneVerificationUnsubscribe = ({
  handleCodeGenerate,
  phoneNumber,
  isLoading,
}: PhoneVerificationUnsubscribeProps) => {
  const [captchaKey, setCaptchaKey] = useState<string>();

  const handleDisablingCodeGenerate = useCallback(async () => {
    if (captchaKey && phoneNumber) {
      await handleCodeGenerate(
        { phone: phoneNumber, recaptcha: captchaKey },
        CodeScopeType.DISABLE,
      );
    }
  }, [phoneNumber, handleCodeGenerate, captchaKey]);

  return (
    <>
      <ReCAPTCHA
        className="profile__google-recaptcha"
        sitekey={REACT_APP_GOOGLE_RECAPTCHA_SITEKEY}
        onChange={e => setCaptchaKey(e)}
      />
      <div className="profile__sms-disable">
        <UIButton
          type="button"
          priority="secondary"
          title="Disable 2-factor authentication"
          disabled={isLoading || !captchaKey}
          isLoading={isLoading}
          handleClick={handleDisablingCodeGenerate}
        />
      </div>
      <button
        type="button"
        disabled={isLoading || !captchaKey}
        className="profile__sms-change"
        onClick={handleDisablingCodeGenerate}
      >
        Change Authentication Number
      </button>
    </>
  );
};

export default PhoneVerificationUnsubscribe;
