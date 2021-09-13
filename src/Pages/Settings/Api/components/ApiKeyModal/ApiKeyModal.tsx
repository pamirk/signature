import { BaseModalProps } from 'Components/UIComponents/interfaces/UIModal';
import UIModal from 'Components/UIComponents/UIModal';
import React, { useCallback, useState } from 'react';
import ApiKeyCreateContent from './ApiKeyCreateContent';
import ApiKeyShowContent from './ApiKeyShowContent';

interface ApiKeyModalProps extends BaseModalProps {
  onSuccessGenerate: () => void;
}

const ApiKeyModal = ({ onClose, onSuccessGenerate }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState<string | undefined>();

  const handleApiKeySuccessGenerate = useCallback(
    (apiKey: string) => {
      setApiKey(apiKey);
      onSuccessGenerate();
    },
    [onSuccessGenerate],
  );

  return (
    <UIModal onClose={onClose} className="apiKeyModal">
      {apiKey ? (
        <ApiKeyShowContent apiKey={apiKey} />
      ) : (
        <ApiKeyCreateContent onApiKeyGenerate={handleApiKeySuccessGenerate} />
      )}
    </UIModal>
  );
};

export default ApiKeyModal;
