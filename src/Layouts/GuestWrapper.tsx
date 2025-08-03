import React from 'react';
import className from 'classnames';
import { WrapperProps } from 'Interfaces/Common';
import Footer from 'Components/Footer';

import Logo from 'Assets/images/logo.svg';
import LogoMobile from 'Assets/images/logoMobile.svg';

interface GuestWrapperProps extends WrapperProps {
  isShowFooter?: boolean;
  isShowHeaderBorder?: boolean;
}

export const GuestWrapper = ({
  children,
  isShowFooter = false,
  isShowHeaderBorder = false,
}: GuestWrapperProps) => {
  return (
    <div className="guest-layout">
      <div
        className={className('guest-layout__header', {
          'guest-layout__header--border': isShowHeaderBorder,
        })}
      >
        <div className="guest-layout__header-item">
          <div className="guest-layout__header-item logo">
            <a href="https://signaturely.com" target="_blank" rel="noopener noreferrer">
              <img src={Logo} alt="Signaturely" />
            </a>
          </div>
          <div className="guest-layout__header-item logo--mobile">
            <a href="https://signaturely.com" target="_blank" rel="noopener noreferrer">
              <img src={LogoMobile} alt="Signaturely" />
            </a>
          </div>
          <div className="guest-layout__header-item">
            <p className="guest-layout__header-item-text">
              eSign documents easily from your <br />
              computer, tablet or phone.
            </p>
          </div>
        </div>
      </div>
      {children}
      {isShowFooter && <Footer />}
    </div>
  );
};
