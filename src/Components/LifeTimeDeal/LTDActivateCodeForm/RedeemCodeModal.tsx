import React from 'react';
import classNames from 'classnames';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { TierInfo } from '../components';
import { LtdTier } from 'Interfaces/Billing';

interface RedeemCodeModalProps {
  tier?: LtdTier;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const RedeemCodeModal = ({
  tier,
  onClose,
  onConfirm,
  isLoading,
}: RedeemCodeModalProps) => {
  const isMobile = useIsMobile();

  if (!tier) return null;

  return (
    <UIModal
      onClose={onClose}
      className={classNames('redeemCodeModal', {
        mobile: isMobile,
      })}
      hideCloseIcon
      shouldCloseOnOverlayClick={false}
    >
      <div className="redeemCodeModal__wrapper">
        <div className="redeemCodeModal__header-container">
          <p className="redeemCodeModal__header-title">Activate License</p>
          <p className="redeemCodeModal__header-subtitle">
            Review the information below before proceeding.
          </p>
        </div>
        <TierInfo tier={tier} />
        <UIButton
          priority="primary"
          className="redeemCodeModal__button successing"
          handleClick={onConfirm}
          title={'Redeem code'}
        />
        <UIButton
          priority="secondary"
          className="redeemCodeModal__button cancelling"
          handleClick={onClose}
          title={'Cancel'}
          isLoading={isLoading}
        />
      </div>
    </UIModal>
  );
};

export default RedeemCodeModal;
