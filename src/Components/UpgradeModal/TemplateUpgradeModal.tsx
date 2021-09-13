import { BaseModalProps } from 'Components/UIComponents/interfaces/UIModal';
import { PlanTypes } from 'Interfaces/Billing';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserPlan } from 'Utils/selectors';
import UpgradeModal from './UpgradeModal';

const TemplateUpgradeModal = ({ onClose }: BaseModalProps) => {
  const { type: planType } = useSelector(selectUserPlan);
  return (
    <UpgradeModal
      title={
        planType === PlanTypes.FREE
          ? 'Please upgrade your account to create a template.'
          : 'Please upgrade your account to create more templates.'
      }
      onClose={onClose}
    >
      {planType === PlanTypes.FREE ? (
        <>
          You&apos;re on the free plan which doesn&apos;t include templates.
          <br />
          Please click below to upgrade your account to access templates.
        </>
      ) : (
        <>
          You&apos;re on the Personal plan which includes one template.
          <br />
          Please upgrade to the Business plan for unlimited templates.
        </>
      )}
    </UpgradeModal>
  );
};

export default TemplateUpgradeModal;
