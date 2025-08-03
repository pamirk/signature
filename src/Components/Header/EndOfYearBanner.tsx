import React, { useCallback, useMemo } from 'react';
import useEndOfYearBanner from 'Hooks/Common/useEndOfYearBanner';
import History from 'Services/History';
import { AuthorizedRoutePaths, UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import { PlanDurations, discountByDuration } from 'Interfaces/Billing';

interface EndOfYearBannerProps {
  isAuthorizedPage?: boolean;
}

const EndOfYearBanner = ({ isAuthorizedPage = true }: EndOfYearBannerProps) => {
  const isMobile = useIsMobile();
  const [isShowBanner] = useEndOfYearBanner();
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
            End of the Year Sale: Get up to {discount}% OFF on all our Plans
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

export default EndOfYearBanner;
