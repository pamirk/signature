import React, { useCallback } from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import { Plan, CardFormValues, ApiPlan } from 'Interfaces/Billing';
import CardFields from 'Components/CardFields';
import { Form } from 'react-final-form';
import { OnSubmitReturnType } from 'Interfaces/FinalForm';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface PayModalProps {
  onClose: () => void;
  plan: Plan | ApiPlan;
  onSubmit: (values: CardFormValues) => OnSubmitReturnType;
  isLoading: boolean;
}

const PayModal = ({ onClose, plan, onSubmit, isLoading }: PayModalProps) => {
  const isMobile = useIsMobile();

  const handleFormSubmit = useCallback(
    async (values: CardFormValues) => {
      await onSubmit(values);
      onClose();
    },
    [onClose, onSubmit],
  );

  return (
    <UIModal onClose={onClose}>
      <div className={`billing__modal${isMobile ? '-mobile' : ''}`}>
        <div className="billing__modal-title">{`Upgrade to ${plan.title}`}</div>
        <Form
          onSubmit={handleFormSubmit}
          render={({ hasValidationErrors, submitting, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} className="card-form">
                <CardFields />
                <div className="billing__modal-button">
                  <UIButton
                    type="submit"
                    priority="primary"
                    isLoading={isLoading}
                    disabled={hasValidationErrors || submitting}
                    title="Upgrade plan"
                  />
                </div>
              </form>
            );
          }}
        />
      </div>
    </UIModal>
  );
};
export default PayModal;
