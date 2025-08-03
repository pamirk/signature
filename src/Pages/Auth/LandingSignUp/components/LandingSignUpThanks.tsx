import React, { useCallback, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import UIButton from 'Components/UIComponents/UIButton';
import SignaturelyLogo from 'Assets/images/logo.svg';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { useNewTabOpen } from 'Hooks/Common';
import { useLocation } from 'react-router-dom';
import { DownloadOption } from 'Interfaces/Auth';

type contentMapType = {
  [option in DownloadOption]: {
    header: string;
    paragraph_1: string;
    paragraph_2?: string;
    buttonText: string;
    postText?: string;
    redirectPath: string;
  };
};

interface LandingSignUpThanksProps {
  option?: DownloadOption;
  documentId?: string;
}

const LandingSignUpThanks = () => {
  const location = useLocation<LandingSignUpThanksProps>();
  const state = location.state;

  const [openNewTab] = useNewTabOpen();

  const [documentId, option] = useMemo(() => {
    if (!state || !state.documentId) {
      return [undefined, DownloadOption.LATER];
    }

    return [state.documentId, state.option ?? DownloadOption.LATER];
  }, [state]);

  const contentMap: contentMapType = {
    [DownloadOption.NOW]: {
      header: 'Thank you for signing up!',
      paragraph_1:
        'Welcome to Signaturely! Your 7-day free trial has begun. You can download your signed file anytime from your dashboard.',
      paragraph_2: 'Want to preview your file? Click below to open it in a new window.',
      buttonText: 'Preview Signed File',
      redirectPath: documentId
        ? `${AuthorizedRoutePaths.DOCUMENTS}/${documentId}/preview`
        : `${AuthorizedRoutePaths.DOCUMENTS}`,
    },
    [DownloadOption.LATER]: {
      header: 'Thank you for signing up!',
      paragraph_1:
        'Welcome to Signaturely! Your 7-day free trial has begun. You can download your signed file anytime from your dashboard.',
      buttonText: 'Go to Dashboard',
      postText:
        'Explore your dashboard to manage your account, view documents, and access all our features.',
      redirectPath: `${AuthorizedRoutePaths.DOCUMENTS}`,
    },
  };

  const content = contentMap[option];

  const navigateToRoot = useCallback(() => {
    openNewTab(content.redirectPath);
  }, [content.redirectPath, openNewTab]);

  return (
    <div className="sign-up-landing__wrapper">
      <div className="sign-up-landing__thanks">
        <div className="sign-up-landing__thanks-container">
          <div className="sign-up-landing__thanks-logo-container">
            <ReactSVG src={SignaturelyLogo} className="sign-up-landing__thanks-logo" />
          </div>
          <h1 className="sign-up-landing__thanks-header">{content.header}</h1>
          <p className="sign-up-landing__thanks-text">{content.paragraph_1}</p>
          {content.paragraph_2 && (
            <p className="sign-up-landing__thanks-text">{content.paragraph_2}</p>
          )}
          <div className="team__accept-button">
            <UIButton
              priority="primary"
              className="sign-up-landing__thanks-button"
              title={`${content.buttonText}`}
              handleClick={navigateToRoot}
            />
          </div>
          {content.postText && (
            <p className="sign-up-landing__thanks-text">{content.postText}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingSignUpThanks;
