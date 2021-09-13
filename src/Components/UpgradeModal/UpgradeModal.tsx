import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import History from 'Services/History';

import UIButton from 'Components/UIComponents/UIButton';
import UIModal from 'Components/UIComponents/UIModal';
import { useModal } from 'Hooks/Common';
import PlanChangeModal from 'Components/PlanChangeModal/PlanChangeModal';

import { selectUser } from 'Utils/selectors';
import { PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { User } from 'Interfaces/User';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

export interface UpgradeModalProps {
  children: React.ReactChild | React.ReactChild[];
  title?: string;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

const UpgradeModal = ({ onClose, children, title }: UpgradeModalProps) => {
  const user: User = useSelector(selectUser);
  const isMobile = useIsMobile();

  const [showPlanChangeModal, hidePlanChangeModal] = useModal(() => {
    return (
      <PlanChangeModal
        planDetails={{
          duration: user.plan.duration,
          type: PlanTypes.BUSINESS,
          title: `Business${
            user.plan.duration === PlanDurations.ANNUALLY ? ' Annually' : ''
          }`,
        }}
        onClose={() => {
          onClose();
          hidePlanChangeModal();
        }}
      />
    );
  });

  const handleUpgrade = useCallback(() => {
    if (user.last4 && user.plan.type === PlanTypes.PERSONAL) {
      showPlanChangeModal();
    } else {
      History.push('/settings/billing/plan');
    }
  }, [showPlanChangeModal, user.last4, user.plan.type]);

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
      </div>
    </UIModal>
  );
};

export default UpgradeModal;
