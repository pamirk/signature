import React from 'react';
import { Link } from 'react-router-dom';
import { WrapperProps } from 'Interfaces/Common';

import Logo from 'Assets/images/logo.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

function SimplifiedWrapper({ children }: WrapperProps) {
  const isMobile = useIsMobile();

  return (
    <div className="login-layout">
      <div className={classNames('login-layout__header', { mobile: isMobile })}>
        <Link to="/">
          <img src={Logo} alt="Signaturely" />
        </Link>
      </div>
      <div className="login-layout__content">{children}</div>
      <div className="login-layout__footer">
        © 2021 Signaturely |&nbsp;
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

export default SimplifiedWrapper;
