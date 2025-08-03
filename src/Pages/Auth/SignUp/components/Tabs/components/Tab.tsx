import React from 'react';
import { ReactSVG } from 'react-svg';
import check from 'Assets/images/icons/check-v2.svg';
import classNames from 'classnames';

interface TabProps {
  text: string;
  tubNumber: number;
  isActive?: boolean;
  isNextTab: boolean;
}

export const Tab = ({ text, tubNumber, isActive, isNextTab }: TabProps) => {
  return (
    <div className={classNames('sign-up-second-step__tab-wrapper')}>
      <div className="sign-up-second-step__tab-text-wrapper">
        <span
          className={classNames('sign-up-second-step__check-icon', {
            'sign-up-second-step__check-icon--next': isNextTab,
          })}
        >
          {isActive || isNextTab ? (
            <p
              className={classNames('sign-up-second-step__tab-number', {
                'sign-up-second-step__tab-number--active': isActive,
              })}
            >
              {tubNumber}
            </p>
          ) : (
            <ReactSVG src={check} />
          )}
        </span>
        <p
          className={classNames('sign-up-second-step__tab-text', {
            'sign-up-second-step__tab-text--active': isActive && !isNextTab,
            'sign-up-second-step__tab-text--next': isNextTab,
          })}
        >
          {text}
        </p>
      </div>
      <div
        className={classNames('sign-up-second-step__tab-underline', {
          'sign-up-second-step__tab-underline--active': isActive,
        })}
      />
    </div>
  );
};
