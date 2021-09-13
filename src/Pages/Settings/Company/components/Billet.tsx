import React from 'react';
import { ReactSVG } from 'react-svg';
import LockIcon from 'Assets/images/icons/lock.svg';

interface BilletProps {
  title: string;
}

const Billet = ({ title }: BilletProps) => {
  return (
    <div className="company__billet">
      <ReactSVG src={LockIcon} className="company__billet-icon" />
      <div className="company__billet-text">{title}</div>
    </div>
  );
};

export default Billet;
