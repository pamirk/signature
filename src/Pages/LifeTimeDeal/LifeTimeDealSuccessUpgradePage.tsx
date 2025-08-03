import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import History from 'Services/History';
import UIButton from 'Components/UIComponents/UIButton';
import CircleSuccessIcon from 'Assets/images/icons/circle-success.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { LtdTier } from 'Interfaces/Billing';
import { LtdTiersIds } from 'Pages/Settings/Billing/screens/LifeTimeDealScreen/planTableItems';
import { TierInfo } from 'Components/LifeTimeDeal/components';
import { useCurrentUserGet } from 'Hooks/User';
import { useLtdTierGet } from 'Hooks/Billing';
import { isNotEmpty } from 'Utils/functions';
import Toast from 'Services/Toast';
import UISpinner from 'Components/UIComponents/UISpinner';
import { RouteComponentProps } from 'react-router-dom';

type tierIdType = { tierId: LtdTier['id'] };

const LifeTimeDealSuccessPaymentPage = ({
  location,
}: RouteComponentProps<tierIdType>) => {
  const isMobile = useIsMobile();
  const [getCurrentUser] = useCurrentUserGet();
  const [getLtdTier, isGettingLtdTier] = useLtdTierGet();
  const [tier, setTier] = useState<LtdTier>();

  const ltdId = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tierId') || undefined;
  }, [location.search]);

  const navigateToRoot = useCallback(async () => {
    await getCurrentUser(undefined);
    History.push(AuthorizedRoutePaths.BASE_PATH);
  }, [getCurrentUser]);

  const handleGetLtdTier = useCallback(async () => {
    if (ltdId) {
      const response = await getLtdTier({ ltdId });

      if (!isNotEmpty(response)) {
        return Toast.error('Something went wrong. Please try again.');
      }

      setTier(response);
    }
  }, [getLtdTier, ltdId]);

  const handleReloadPage = useCallback(() => {
    const reloadCount = Number(sessionStorage.getItem('reloadCount'));
    if (reloadCount < 1) {
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloadCount');
    }
  }, []);

  useEffect(() => {
    handleGetLtdTier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ltdId || !(ltdId && Object.values(LtdTiersIds).includes(ltdId as LtdTiersIds))) {
      History.push(AuthorizedRoutePaths.BASE_PATH);
    }
  }, [ltdId]);

  useEffect(() => {
    handleReloadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isGettingLtdTier || !tier) {
    return (
      <UISpinner
        wrapperClassName="spinner--main__wrapper card-form__spinner"
        width={60}
        height={60}
      />
    );
  }

  return (
    <div
      className={classNames('successLtdPayment', {
        mobile: isMobile,
      })}
    >
      <div
        className={classNames('successLtdPayment__main', {
          mobile: isMobile,
        })}
      >
        <ReactSVG src={CircleSuccessIcon} className="successLtdPayment__main-icon" />
        <div className="successLtdPayment__text-wrapper">
          <p className="successLtdPayment__title">Upgrade successful!</p>
          <p className="successLtdPayment__text">
            Your account has been upgraded to {tier.name}. Now, you have access to the
            following new features:
          </p>
        </div>
        <TierInfo tier={tier} />
        <UIButton
          priority="primary"
          className="successLtdPayment__button"
          handleClick={navigateToRoot}
          title={`Go to dashboard`}
        />
      </div>
    </div>
  );
};

export default LifeTimeDealSuccessPaymentPage;
