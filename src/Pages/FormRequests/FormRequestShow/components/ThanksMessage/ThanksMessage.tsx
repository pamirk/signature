import React from 'react';
import { Helmet } from 'react-helmet';
import Logo from 'Assets/images/logo.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

interface ThanksMessageProps {
  companyLogo: string | undefined;
}
const ThanksMessage = ({ companyLogo }: ThanksMessageProps) => {
  const isMobile = useIsMobile();
  return (
    <div className="form-request__thanksMessage">
      <div className="form-request">
        <Helmet>
          <meta name="description" content="Log in to Signaturely." />
          <title>Thanks</title>
        </Helmet>
        <div className="form-request__form--border">
          <div
            className={classNames('form-request__form', 'form-request__form--login', {
              mobile: isMobile,
            })}
          >
            <div className="form-request__logo">
              {companyLogo ? (
                <img src={companyLogo} />
              ) : (
                <img src={Logo} alt="Signaturely" />
              )}
            </div>
            <div className="form-request__title">Please check your email</div>
            <div className="form-request__subtitle">
              The document has been emailed for the next steps. Please check your email to
              complete the document.
            </div>
          </div>
          <div className="form-request__footer">
            Powered by{' '}
            <div className="form-request__footer--signaturely">Signaturely</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanksMessage;
