import React, { useCallback } from 'react';
import History from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

const TrialBanner = () => {
  const isMobile = useIsMobile();
  const handleRedirect = useCallback(() => {
    History.push(AuthorizedRoutePaths.TRY_TRIAL);
  }, []);

  return (
    <div className={classNames('header__banner', { mobile: isMobile })}>
      <div className="banner__container">
        <div className="banner__title">
          <span className="title__light">You have a 7-day Free Business Trial</span>
        </div>
        <div className="banner__button" onClick={handleRedirect}>
          Try now
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
