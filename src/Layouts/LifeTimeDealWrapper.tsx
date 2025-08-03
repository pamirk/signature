import React from 'react';
import { Link } from 'react-router-dom';
import { WrapperProps } from 'Interfaces/Common';

import Logo from 'Assets/images/logo.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import BlackFridayBanner from 'Components/Header/BlackFridayBanner';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import EndOfYearBanner from 'Components/Header/EndOfYearBanner';
import { CURRENT_YEAR } from 'Utils/constants';

function LifeTimeDealWrapper({ children }: WrapperProps) {
  const isMobile = useIsMobile();

  return (
    <div className="login-layout">
      <BlackFridayBanner isAuthorizedPage={false} />
      <EndOfYearBanner isAuthorizedPage={false} />
      <div className={classNames('login-layout__header', { mobile: isMobile })}>
        <Link to={UnauthorizedRoutePaths.BASE_PATH}>
          <img src={Logo} alt="Signaturely" />
        </Link>
      </div>
      <div className="login-layout__content">
        <div className="lifeTimeDeal__common-wrapper">
          <div className="lifeTimeDeal__common-wrapper__content">{children}</div>
        </div>
      </div>
      <div className="login-layout__footer">
        © {CURRENT_YEAR} Signaturely |&nbsp;
        <a
          className="login-layout__link"
          href="https://signaturely.com/terms/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms and Conditions
        </a>
      </div>
    </div>
  );
}

export default LifeTimeDealWrapper;
