import React, { useEffect } from 'react';
import useDropdown from 'use-dropdown';
import { Location } from 'history';
import { ReactSVG } from 'react-svg';
import MenuIcon from 'Assets/images/icons/menu.svg';
import CloseIcon from 'Assets/images/icons/close-icon.svg';
import { Menu } from './Menu';

export interface DropDownUserProps {
  handleLogout: () => void;
  location: Location;
  isSignaturesLimited: boolean;
}

function DropDownMenu({
  handleLogout,
  isSignaturesLimited,
  location,
}: DropDownUserProps) {
  const [containerRef, isOpen, open, close] = useDropdown();
  const { pathname } = location;
  useEffect(close, [close, pathname]);

  return (
    <div className="dropDownMenu__wrapper" ref={containerRef}>
      <ReactSVG
        src={isOpen ? CloseIcon : MenuIcon}
        onClick={isOpen ? close : open}
        className="dropDownMenu__trigger-arrow dropDownMenu__trigger-arrow--open"
      />
      {isOpen && (
        <Menu handleLogout={handleLogout} isSignaturesLimited={isSignaturesLimited} />
      )}
    </div>
  );
}

export default DropDownMenu;
