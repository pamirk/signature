import React, { useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import History from 'Services/History';
import UIButton from 'Components/UIComponents/UIButton';
import PlusLogo from 'Assets/images/icons/plus.svg';
import AppSumoLogo from 'Assets/images/icons/appsumo.svg';
import SignaturelyLogo from 'Assets/images/logo.svg';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

const AppSumoThanks = () => {
  const navigateToRoot = useCallback(() => {
    History.replace(AuthorizedRoutePaths.BASE_PATH);
  }, []);

  return (
    <div className="appsumo">
      <div className="appsumo__container">
        <div className="appsumo__logo-container">
          <ReactSVG src={SignaturelyLogo} className="appsumo__logo" />
          <ReactSVG src={PlusLogo} className="appsumo__logo appsumo__logo-plus" />
          <ReactSVG src={AppSumoLogo} className="appsumo__logo" />
        </div>
        <h1 className="appsumo__header">
          Thanks for registering to the AppSumo promotion.
        </h1>
        <p className="appsumo__text">
          We are very excited to have you on board! Welcome to the team.
        </p>
        <div className="team__accept-button">
          <UIButton
            priority="primary"
            title="Start using Signaturely"
            handleClick={navigateToRoot}
          />
        </div>
      </div>
    </div>
  );
};

export default AppSumoThanks;
