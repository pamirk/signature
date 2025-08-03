import React from 'react';
import {PlanDurations} from 'Interfaces/Billing';

interface DiscountBilletProps {
    duration: PlanDurations;
}

export const DiscountBillet: React.FC<DiscountBilletProps> = ({duration}) => {
    const discountPercentage = {
        [PlanDurations.MONTHLY]: '20%',
        [PlanDurations.ANNUALLY]: '40%',
        [PlanDurations.FOREVER]: '50%',
    };

    return (
        <div className="billing__discount-billet">
      <span className="billing__discount-text">
        Save {discountPercentage[duration]}
      </span>
        </div>
    );
};

export default DiscountBillet;