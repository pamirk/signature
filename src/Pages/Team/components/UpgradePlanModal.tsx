import React, { useCallback } from 'react';
import { Form } from 'react-final-form';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import { CardFormValues, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import CardFields from 'Components/CardFields';
import { useCreateCard, usePlanChange } from 'Hooks/Billing';
import { FacebookPixel, DataLayerAnalytics } from 'Services/Integrations';
import Toast from 'Services/Toast';

interface UpgradePlanModalProps {
  onClose: () => void;
  onSuccessUpgrade: () => void;
}

const UpgradePlanModal = ({ onClose, onSuccessUpgrade }: UpgradePlanModalProps) => {
  const [changePlan] = usePlanChange();
  const [createCard] = useCreateCard();

  const handleChangePlan = useCallback(async () => {
    try {
      const payload = { type: PlanTypes.BUSINESS, duration: PlanDurations.MONTHLY };
      await changePlan(payload);

      FacebookPixel.firePlanChangeEvent(payload);
      DataLayerAnalytics.firePlanChangeEvent(payload);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [changePlan]);

  const handlePaySubmit = useCallback(
    async (values: CardFormValues) => {
      try {
        await createCard(values);
        await handleChangePlan();
        Toast.success('Subscription successfully created');
        onSuccessUpgrade();
        onClose();
        Toast.success('Plan has been successfully changed.');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [createCard, handleChangePlan, onClose, onSuccessUpgrade],
  );

  return (
    <UIModal onClose={onClose}>
      <div className="billing__modal">
        <div className="billing__modal-title">{`Add 1 extra user`}</div>
        <div className="appsumo-pay-modal__container">
          <div className="appsumo-pay-modal__title appsumo-pay-modal__text">
            Your AppSumo unlimited plan only includes 3 users, in order to keep adding
            more, please add your credit card.
          </div>
        </div>
        <div className="appsumo-pay-modal__container">
          <div className="appsumo-pay-modal__description appsumo-pay-modal__text">
            Each additional users will be billed at
            <span className="appsumo-pay-modal__bold">&nbsp;$30 per month</span>, per
            user.
          </div>
        </div>
        <Form
          onSubmit={handlePaySubmit}
          render={({ hasValidationErrors, submitting, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} className="card-form">
                <CardFields />
                <UIButton
                  type="submit"
                  priority="primary"
                  isLoading={submitting}
                  disabled={hasValidationErrors || submitting}
                  title="Add team member"
                />
              </form>
            );
          }}
        />
      </div>
    </UIModal>
  );
};
export default UpgradePlanModal;
