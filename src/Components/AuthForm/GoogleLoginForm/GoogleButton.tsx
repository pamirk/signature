import React from 'react';
import GoogleIcon from 'Assets/images/icons/google-icon.svg';
import { ReactSVG } from 'react-svg';

interface GoogleButtonProps {
  handleClick?: () => void;
  title?: string;
}

const GoogleButton = ({ handleClick, title }: GoogleButtonProps) => {
  return (
    <button className="auth__googleButton" onClick={handleClick}>
      <ReactSVG src={GoogleIcon} className="button__ico" />
      <p className="button__text">{title}</p>
    </button>
  );
};

export default GoogleButton;
