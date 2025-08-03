import React from 'react';
import classNames from 'classnames';
import { useIsMobile } from 'Hooks/Common';
import { Document } from 'Interfaces/Document';
import { LandingSignUpForm } from './components';

interface LandingSignUpProps {
  document?: Document;
}

export const LandingSignUp = ({ document }: LandingSignUpProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={classNames('sign-up-landing__signUp-form', { mobile: isMobile })}>
      <div className="sign-up-landing__signUp-info-container">
        <p className="sign-up-landing__signUp-info-header">Get started</p>
        <p className="sign-up-landing__signUp-info-text">
          Please add your payment details to start the free trial, the document will be
          available once you sign up. You can cancel anytime before the free trial ends to
          avoid being billed.
        </p>
      </div>
      <div className="sign-up-landing__signUp-content-container">
        <LandingSignUpForm document={document} />
      </div>
    </div>
  );
};

export default LandingSignUp;
