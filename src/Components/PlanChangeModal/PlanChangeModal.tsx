import React, { useCallback } from 'react';
import { BaseModalProps } from 'Components/UIComponents/interfaces/UIModal';
import { Plan, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { usePlanChange } from 'Hooks/Billing';
import { FacebookPixel, DataLayerAnalytics } from 'Services/Integrations';
import Toast from 'Services/Toast';
import ConfirmModal from 'Components/ConfirmModal';

export interface PlanChangeModalProps extends BaseModalProps {
  planDetails: Plan;
}

const PlanChangeModal = ({ planDetails, onClose }: PlanChangeModalProps) => {
  const [changePlan, isChangePlanLoading] = usePlanChange();

  const handleChangePlan = useCallback(async () => {
    try {
      const { title, ...payload } = planDetails;
      await changePlan(payload);

      if (payload.type !== PlanTypes.FREE) {
        FacebookPixel.firePlanChangeEvent(payload);
      }

      DataLayerAnalytics.firePlanChangeEvent(payload);
      Toast.success('Plan has been successfully changed.');
      onClose();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [changePlan, onClose, planDetails]);

  return (
    <ConfirmModal
      onClose={onClose}
      isCancellable
      confirmButtonProps={{
        isLoading: isChangePlanLoading,
        disabled: isChangePlanLoading,
        priority: 'primary',
        handleClick: handleChangePlan,
        title: 'Upgrade Plan',
      }}
      onCancel={onClose}
    >
      <div className="billing__plan-modal">
        <div className="billing__plan-modal-title">{`Change plan to ${planDetails.title}`}</div>
        <div className="billing__plan-modal-subtitle">
          Do you want to change your plan to {planDetails.title}?
        </div>
      </div>
    </ConfirmModal>
  );
};

export default PlanChangeModal;
