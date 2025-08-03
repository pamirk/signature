import React, { useCallback } from 'react';
import { useChargeRetry } from 'Hooks/Billing';
import UIButton from 'Components/UIComponents/UIButton';
import Toast from 'Services/Toast';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User, UserStatuses } from 'Interfaces/User';

const PastDueForm = () => {
  const [retryCharge, isRetryingCharge] = useChargeRetry();
  const user: User = useSelector(selectUser);

  const handleRetryCharge = useCallback(async () => {
    try {
      await retryCharge(undefined);
      Toast.success('Subscription paid');
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [retryCharge]);

  if (user.status !== UserStatuses.FREEZE) {
    return null;
  }

  return (
    <div className="pastDue">
      <div className="pastDue__message">
        Your current subscription has not been paid; the account has been disabled. Please
        check your payment method.
      </div>
      <div className="pastDue__button">
        <UIButton
          title="Retry charge"
          handleClick={handleRetryCharge}
          priority="primary"
          isLoading={isRetryingCharge}
        />
      </div>
    </div>
  );
};

export default PastDueForm;
