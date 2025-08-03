import React, { useCallback } from 'react';
import History from 'Services/History';

import UIButton from 'Components/UIComponents/UIButton';
import UIModal from 'Components/UIComponents/UIModal';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

export interface UpgradeModalProps {
  children: React.ReactChild | React.ReactChild[];
  title?: string;
  onClose: () => void;
  onUpgradeClick?: () => void;
  cancelComponent?: React.FunctionComponent;
}

const UpgradeModal = ({
  onClose,
  children,
  title,
  onUpgradeClick,
  cancelComponent: CancelComponent,
}: UpgradeModalProps) => {
  const isMobile = useIsMobile();

  const handleUpgrade = useCallback(() => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      History.push(AuthorizedRoutePaths.SETTINGS_BILLING_PLAN);
    }
  }, [onUpgradeClick]);

  return (
    <UIModal
      onClose={onClose}
      className={classNames('upgradeModal', { mobile: isMobile })}
    >
      <div className="upgradeModal__inner">
        <div className="upgradeModal__content">
          <h4 className="upgradeModal__title">
            {title || 'Please upgrade your Signaturely account!'}
          </h4>
          <p className="upgradeModal__text">{children}</p>
        </div>
        <UIButton
          priority="primary"
          title="Upgrade Account"
          handleClick={handleUpgrade}
        />
        {CancelComponent && <CancelComponent />}
      </div>
    </UIModal>
  );
};

export default UpgradeModal;
