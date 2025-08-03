import React, { useCallback, useEffect, useState } from 'react';
import History from 'Services/History';
import { StaticContext } from 'react-router';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { PaymentBlock, TierInfo } from 'Components/LifeTimeDeal/components';
import { LtdCheckoutUpgradeResponse, LtdTier } from 'Interfaces/Billing';
import { User } from 'Interfaces/User';
import { RouteComponentProps } from 'react-router-dom';
import { usePaymentCheckoutUpgrade, usePaypalOrderCapture } from 'Hooks/Billing';
import { isNotEmpty } from 'Utils/functions';
import Toast from 'Services/Toast';
import UISpinner from 'Components/UIComponents/UISpinner';
import {
  LtdTiersIds,
  tierNumberById,
} from 'Pages/Settings/Billing/screens/LifeTimeDealScreen/planTableItems';
import { selectUser } from 'Utils/selectors';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface LifeTimeDealUpgradeProps {
  newTierId: LtdTier['id'];
}

const LifeTimeDealUpgrade = ({
  location,
}: RouteComponentProps<{}, StaticContext, LifeTimeDealUpgradeProps>) => {
  const [
    upgradeLtdPaymentCheckout,
    isUpgradeLtdPaymentCheckout,
  ] = usePaymentCheckoutUpgrade();
  const [capturePaypalOrder] = usePaypalOrderCapture();
  const isMobile = useIsMobile();

  const [showCheckoutButton, setShowCheckoutButton] = useState(false);
  const [checkoutResponse, setCheckoutResponse] = useState<LtdCheckoutUpgradeResponse>();

  const ltdId = location.state?.newTierId;
  const currentUser: User = useSelector(selectUser);

  const handleOpenStripeCheckout = useCallback(async () => {
    if (checkoutResponse?.stripeCheckoutUrl)
      window.location.replace(checkoutResponse.stripeCheckoutUrl);
  }, [checkoutResponse]);

  const handleOpenPaypalCheckout = useCallback(async () => {
    if (checkoutResponse?.paypalOrderId) {
      await capturePaypalOrder({ orderId: checkoutResponse.paypalOrderId });
      History.push(`${AuthorizedRoutePaths.LTD_UPGRADE_SUCCESS}?tierId=${ltdId}`);
    }
  }, [capturePaypalOrder, checkoutResponse, ltdId]);

  const handleGetUpgradeCheckout = useCallback(async () => {
    if (ltdId) {
      const response = await upgradeLtdPaymentCheckout({
        ltdId,
        successUrl: `${window.location.origin}${AuthorizedRoutePaths.LTD_UPGRADE_SUCCESS}?tierId=${ltdId}`,
        cancelUrl: `${window.location.href}`,
      });

      if (!isNotEmpty(response)) {
        return Toast.error('Something went wrong. Please try again.');
      }

      setCheckoutResponse(response);

      setShowCheckoutButton(true);
    }
  }, [ltdId, upgradeLtdPaymentCheckout]);

  useEffect(() => {
    if (
      !ltdId ||
      !(ltdId && Object.values(LtdTiersIds).includes(ltdId as LtdTiersIds)) ||
      tierNumberById[ltdId] <= tierNumberById[currentUser.ltdTierId]
    ) {
      History.push(AuthorizedRoutePaths.SETTINGS_BILLING_PLAN);
    } else {
      handleGetUpgradeCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.ltdTierId, ltdId]);

  return isUpgradeLtdPaymentCheckout || !checkoutResponse ? (
    <UISpinner
      wrapperClassName="spinner--main__wrapper card-form__spinner"
      width={50}
      height={50}
    />
  ) : (
    <div className={classNames('lifeTimeDeal__common-container', { mobile: isMobile })}>
      <p className="lifeTimeDeal__common-container__title">
        Upgrading from {checkoutResponse.currentTier.name} to{' '}
        {checkoutResponse.newTier.name}
      </p>
      <p className="lifeTimeDeal__common-container__subtitle">
        Review the new features you&apos;ll get after the upgrade.
      </p>
      <div
        className={classNames('lifeTimeDeal__common-tierInfo__container', {
          mobile: isMobile,
        })}
      >
        <TierInfo
          tier={checkoutResponse?.currentTier}
          billetText="Current"
          wrapperClassName={classNames(
            'lifeTimeDeal__common-tierInfo__currentTier-wrapper',
            { mobile: isMobile },
          )}
          needPricing={true}
          disabled={true}
        />
        <TierInfo
          tier={checkoutResponse.newTier}
          billetText="New"
          wrapperClassName={classNames('lifeTimeDeal__common-tierInfo__newTier-wrapper', {
            mobile: isMobile,
          })}
          billetClassName="lifeTimeDeal__common-tierInfo__newTier-billet"
          needPricing={true}
        />
        {!isMobile && (
          <div className="lifeTimeDeal__common-tierInfo__total left">
            <div className="lifeTimeDeal__common-tierInfo__total left--content"></div>
          </div>
        )}
        <div
          className={classNames('lifeTimeDeal__common-tierInfo__total right', {
            mobile: isMobile,
          })}
        >
          <div className="lifeTimeDeal__common-tierInfo__total right-content">
            <p className="redeemCodeModal__tierInfo-info__item-name">Total to pay</p>
            <p className="redeemCodeModal__tierInfo-info__item-value">
              ${checkoutResponse.total}
            </p>
          </div>
        </div>
      </div>
      {showCheckoutButton && (
        <PaymentBlock
          openStripeCheckout={handleOpenStripeCheckout}
          createPaypalOrder={() => checkoutResponse.paypalOrderId}
          approvePaypalPayment={handleOpenPaypalCheckout}
          paymentButtonText="Purchase now"
          footerContainerClassName="lifeTimeDeal__common-button__checkout-container"
          policyClassName="lifeTimeDeal__common-button__checkout-policy"
        />
      )}
    </div>
  );
};

export default LifeTimeDealUpgrade;
