import React, { useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import LockIcon from 'Assets/images/icons/lock.svg';
import History from 'Services/History';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
interface BilletProps {
  title: string;
}

const Billet = ({ title }: BilletProps) => {
  const handleClick = useCallback(() => {
    History.push(AuthorizedRoutePaths.SETTINGS_BILLING_PLAN);
  }, []);

  return (
    <div className="company__billet" onClick={handleClick}>
      <ReactSVG src={LockIcon} className="company__billet-icon" />
      <div className="company__billet-text">{title}</div>
    </div>
  );
};

export default Billet;
