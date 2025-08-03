import React, { useCallback, useEffect, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import UIButton from 'Components/UIComponents/UIButton';
import PresentIcon from 'Assets/images/icons/present.svg';
import UISpinner from 'Components/UIComponents/UISpinner';
import { usePlanUpsell, useUpsellAllowedCheck } from 'Hooks/Billing';
import History from 'Services/History';
import Toast from 'Services/Toast';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import {
  DefaultUpsellDiscount,
  PlanDurations,
  defaultPlanPrices,
  getTotalPrice,
} from 'Interfaces/Billing';
import { User } from 'Interfaces/User';

const Upsell = () => {
  const user: User = useSelector(selectUser);
  const [upsellPlan, isPlanUpselling] = usePlanUpsell();
  const [checkUpsellAllowed, isCheckingUpsellAllowed] = useUpsellAllowedCheck();

  const [monthlyUpsellPrice, annuallyUpsellPrice] = useMemo(
    () => [
      getTotalPrice(
        defaultPlanPrices[user.plan.type][PlanDurations.MONTHLY],
        DefaultUpsellDiscount,
      ),
      getTotalPrice(
        defaultPlanPrices[user.plan.type][PlanDurations.ANNUALLY],
        DefaultUpsellDiscount,
      ) * 12,
    ],
    [user],
  );

  const handleRedirect = useCallback(
    () => History.push(AuthorizedRoutePaths.SETTINGS_BILLING),
    [],
  );

  const handleUpsell = useCallback(async () => {
    try {
      await upsellPlan(undefined);
      Toast.success('Plan has upgraded');
      handleRedirect();
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [handleRedirect, upsellPlan]);

  const handleUpsellAllowedCheck = useCallback(async () => {
    try {
      await checkUpsellAllowed(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      handleRedirect();
    }
  }, [checkUpsellAllowed, handleRedirect]);

  useEffect(() => {
    handleUpsellAllowedCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCheckingUpsellAllowed) {
    return (
      <UISpinner
        wrapperClassName="spinner--main__wrapper card-form__spinner"
        width={60}
        height={60}
      />
    );
  }

  return (
    <div className="upsellModal">
      <div className="upsellModal__icon-container">
        <div className="upsellModal__icon">
          <ReactSVG src={PresentIcon} />
        </div>
      </div>
      <div className="upsellModal__title">WAIT! Special one-time offer</div>
      <div className="upsellModal__content">
        <p>
          To thank you for choosing Signaturely, we would like to
          <br />
          offer you <span className="black-text">30% off for paying annually.</span>
        </p>
        <p>
          Instead of paying ${defaultPlanPrices[user.plan.type][PlanDurations.MONTHLY]}
          /month, you would pay only
          <br />
          <span className="black-text">
            ${monthlyUpsellPrice}/month billed annually ($
            {annuallyUpsellPrice}).
          </span>
        </p>
      </div>
      <div className="upsellModal__buttons">
        <UIButton
          priority="primary"
          handleClick={handleUpsell}
          title="Yes, upgrade me!"
          isLoading={isPlanUpselling}
          disabled={isPlanUpselling}
        />
        <div className="upsellModal__button-cancel" onClick={handleRedirect}>
          No thanks
        </div>
      </div>
    </div>
  );
};

export default Upsell;
