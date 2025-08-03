import React, { useCallback } from 'react';
import { FieldTextInput } from 'Components/FormFields';
import UIButton from 'Components/UIComponents/UIButton';
import { useApiKeyCreate } from 'Hooks/ApiKeys';
import { Field, Form } from 'react-final-form';
import Toast from 'Services/Toast';
import { isNotEmpty } from 'Utils/functions';
import { required } from 'Utils/validation';

interface ApiKeyCreateContentProps {
  onApiKeyGenerate: (apiKey: string) => void;
}

const ApiKeyCreateContent = ({ onApiKeyGenerate }: ApiKeyCreateContentProps) => {
  const [createApiKey, isLoading] = useApiKeyCreate();

  const handleSubmit = useCallback(
    async values => {
      try {
        const result = await createApiKey(values);

        if (isNotEmpty(result)) {
          onApiKeyGenerate(result.key);
        }
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [createApiKey, onApiKeyGenerate],
  );

  return (
    <div className="apiKeyModal_wrapper">
      <div className="modal__header modal__title modal--center">Create your API</div>
      <div className="apiKeyModal__description modal__description modal__subTitle--center apiKeyModal__gap">
        Type a API Key name that you will remember so you can identify it to monitor
        future usage.
      </div>
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="settings__field">
              <Field
                name="name"
                label="API name"
                component={FieldTextInput}
                placeholder="API key name"
                validate={required}
              />
            </div>
            <UIButton
              isLoading={isLoading}
              priority="primary"
              handleClick={handleSubmit}
              title="Create API"
            />
          </form>
        )}
      />
    </div>
  );
};

export default ApiKeyCreateContent;
