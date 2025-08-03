import React from 'react';
import UIModal from 'Components/UIComponents/UIModal';
import { Plan, ApiPlan, Coupon } from 'Interfaces/Billing';
import PromoCodeField from './PromoCodeField';

interface PromoCodeModalProps {
  onClose: () => void;
  plan: Plan | ApiPlan;
  onUpdateCoupon?: (coupon?: Coupon) => void;
}

const PromoCodeModal = ({ onClose, ...props }: PromoCodeModalProps) => {
  return (
    <UIModal onClose={onClose} className="promocode">
      <PromoCodeField {...props} />
    </UIModal>
  );
};

export default PromoCodeModal;
