import React from 'react';
import { UIModalProps } from './interfaces/UIModal';
import ReactModal from 'react-modal';
import classNames from 'classnames';
import CloseIcon from 'Assets/images/icons/close-icon.svg';
import { ReactSVG } from 'react-svg';
import useIsMobile from 'Hooks/Common/useIsMobile';

function UIModal({
  onClose,
  children,
  className,
  overlayClassName,
  isOverlayTransparent = false,
  hideCloseIcon = false,
  shouldCloseOnOverlayClick = true,
}: UIModalProps) {
  const isMobile = useIsMobile();
  return (
    <ReactModal
      className={classNames('modal__dialog', className, { mobile: isMobile })}
      overlayClassName={classNames('modal', overlayClassName, {
        'modal--transparent': isOverlayTransparent,
      })}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      onRequestClose={onClose}
      isOpen
    >
      {!hideCloseIcon && (
        <ReactSVG src={CloseIcon} onClick={onClose} className="modal__close-button" />
      )}
      {children}
    </ReactModal>
  );
}

export default UIModal;
