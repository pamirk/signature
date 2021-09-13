import CardFields from 'Components/CardFields/CardFields';
import CardFieldsMobile from 'Components/CardFields/CardFieldsMobile';
import UIButton from 'Components/UIComponents/UIButton';
import { useCreateCard, useUpdateCard } from 'Hooks/Billing';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { CardFormValues } from 'Interfaces/Billing';
import React, { useCallback, useMemo } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import Toast from 'Services/Toast';

export interface CardFormProps {
  isLoading?: boolean;
  cardInitialValues?: CardFormValues;
  cardType?: string;
  extraButtonRenderProps?: () => React.ReactNode;
}

const CardForm = ({
  cardInitialValues,
  cardType,
  isLoading,
  extraButtonRenderProps,
}: CardFormProps) => {
  const [createCard, isCreateLoading] = useCreateCard();
  const [updateCard, isUpdateLoading] = useUpdateCard();
  const isMobile = useIsMobile();
  const buttonText = useMemo(() => (cardInitialValues ? 'Update Card' : 'Create Card'), [
    cardInitialValues,
  ]);

  const handleSubmit = useCallback(
    async (values: CardFormValues) => {
      try {
        if (cardInitialValues) {
          await updateCard(values);
        } else {
          await createCard(values);
        }
        Toast.success('Card details updated');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [cardInitialValues, createCard, updateCard],
  );

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={cardInitialValues}
      render={({
        form,
        values,
        hasValidationErrors,
        submitting,
        handleSubmit,
      }: FormRenderProps<CardFormValues>) => {
        return (
          <form onSubmit={handleSubmit} className="card-form">
            {isMobile ? (
              <CardFieldsMobile isLoading={isLoading} cardType={cardType} />
            ) : (
              <CardFields isLoading={isLoading} cardType={cardType} />
            )}
            <div className="card-form__buttons">
              <UIButton
                priority="secondary"
                handleClick={async e => {
                  await handleSubmit(e);
                  Object.keys(values).forEach((name:any) => form.resetFieldState(name));
                  form.reset();
                }}
                title={buttonText}
                disabled={hasValidationErrors || submitting || isLoading}
                isLoading={submitting || isUpdateLoading || isCreateLoading}
              />
              {extraButtonRenderProps && extraButtonRenderProps()}
            </div>
          </form>
        );
      }}
    />
  );
};

export default CardForm;
