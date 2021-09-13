import React, { useCallback } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import Toast from 'Services/Toast';

interface ApiKeyShowContentProps {
  apiKey: string;
}

const ApiKeyShowContent = ({ apiKey }: ApiKeyShowContentProps) => {
  const handleApKeyCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      Toast.success('API key successfully copied to clipboard');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [apiKey]);

  return (
    <div className="apiKeyModal_wrapper">
      <div className="modal__header modal__title modal--center">
        You’ve created your API
      </div>
      <div className="apiKeyModal__description modal__description modal__subTitle--center apiKeyModal__small-gap">
        Copy the API key below to start using it to make requests to the Signaturely API.
      </div>
      <div className="apiKeyModal__value">{apiKey}</div>
      <UIButton priority="primary" handleClick={handleApKeyCopy} title="Copy API" />
    </div>
  );
};

export default ApiKeyShowContent;
