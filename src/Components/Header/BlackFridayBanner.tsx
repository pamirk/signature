import React, { useCallback, useMemo } from 'react';
import useBlackFridayBanner from 'Hooks/Common/useBlackFridayBanner';
import History from 'Services/History';
import { AuthorizedRoutePaths, UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import { PlanDurations, discountByDuration } from 'Interfaces/Billing';

interface BlackFridayBannerProps {
  isAuthorizedPage?: boolean;
}

const BlackFridayBanner = ({ isAuthorizedPage = true }: BlackFridayBannerProps) => {
  const isMobile = useIsMobile();
  const [isShowBanner] = useBlackFridayBanner();
  const isShowRedirect = useMemo(() => {
    const path = History.location.pathname;

    if (
      path === UnauthorizedRoutePaths.SIGN_UP_BUSINESS ||
      path === UnauthorizedRoutePaths.SIGN_UP_PERSONAL
    ) {
      return false;
    }

    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [History.location.pathname]);

  const discount = discountByDuration[PlanDurations.ANNUALLY];

  const handleRedirect = useCallback(() => {
    if (!isAuthorizedPage) {
      return History.push(UnauthorizedRoutePaths.SIGN_UP_BUSINESS);
    }

    History.push(AuthorizedRoutePaths.SETTINGS_BILLING_PLAN);
  }, [isAuthorizedPage]);

  if (!isShowBanner) {
    return null;
  }

  return (
    <div className={classNames('header__banner', { mobile: isMobile })}>
      <div className="banner__container">
        <div className="banner__title">
          <span className="title__light">
            Black Friday: Get up to {discount}% OFF on our Business Plan
          </span>
        </div>
        {isShowRedirect && (
          <div className="banner__button" onClick={handleRedirect}>
            Save now
          </div>
        )}
      </div>
    </div>
  );
};

export default BlackFridayBanner;
