import UISpinner from 'Components/UIComponents/UISpinner';
import React from 'react';

export interface MobileButtonProps {
  handleClick: () => void;
  title: string;
  disabled: boolean;
  isLoading?: boolean;
}

export const SigningButtonMobile = ({
  handleClick,
  title,
  disabled,
  isLoading = false,
}: MobileButtonProps) => {
  return (
    <button className="next-btn-mobile" onClick={handleClick} disabled={disabled}>
      {isLoading && <UISpinner wrapperClassName="button__spinner" />}
      <p>{title}</p>
    </button>
  );
};
