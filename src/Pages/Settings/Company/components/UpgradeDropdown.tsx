import React from 'react';
import { ReactSVG } from 'react-svg';
import UIButton from 'Components/UIComponents/UIButton';
import CloseIcon from 'Assets/images/icons/close-icon.svg';

interface UpgradeDropdownProps {
  onClick: () => void;
  onClose?: () => void;
}

const UpgradeDropdown = ({ onClick, onClose }: UpgradeDropdownProps) => {
  return (
    <div className="company__upgrade">
      <ReactSVG src={CloseIcon} onClick={onClose} className="modal__close-button" />
      <p className="company__upgrade-title">Upgrade to Business to unlock this feature</p>
      <p className="company__upgrade-description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus magna quis
        congue duis.
      </p>
      <UIButton handleClick={onClick} title="Upgrade to Business" priority="primary" />
    </div>
  );
};

export default UpgradeDropdown;
