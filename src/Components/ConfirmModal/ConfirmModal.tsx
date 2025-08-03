import React from 'react';
import classNames from 'classnames';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton, { UIButtonProps } from 'Components/UIComponents/UIButton';
import { UIModalProps } from 'Components/UIComponents/interfaces/UIModal';
import useIsMobile from 'Hooks/Common/useIsMobile';

export interface ConfirmModalProps extends UIModalProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonProps?: Partial<UIButtonProps>;
  cancelButtonProps?: Partial<UIButtonProps>;
  confirmComponent?: React.FunctionComponent;
  cancelComponent?: React.FunctionComponent;
  buttonsBlockClassName?: string;
  isCancellable?: boolean;
  footer?: React.ReactNode;
}

function ConfirmModal({
  onConfirm,
  onCancel,
  onClose,
  children,
  confirmText,
  cancelText,
  confirmButtonProps,
  cancelButtonProps,
  confirmComponent: ConfirmComponent,
  cancelComponent: CancelComponent,
  buttonsBlockClassName,
  isCancellable = true,
  footer,
  ...modalProps
}: ConfirmModalProps) {
  const isMobile = useIsMobile();
  return (
    <UIModal onClose={onClose} {...modalProps}>
      <div className="confirmModal">
        <div className={classNames('confirmModal__content', { mobile: isMobile })}>
          {children}
        </div>
        <div className={classNames('confirmModal__buttons', buttonsBlockClassName)}>
          <div className="confirmModal__button">
            {ConfirmComponent ? (
              <ConfirmComponent />
            ) : (
              <UIButton
                priority="primary"
                title={confirmText || 'OK'}
                handleClick={onConfirm}
                {...confirmButtonProps}
              />
            )}
          </div>
          {isCancellable &&
            (CancelComponent ? (
              <CancelComponent />
            ) : (
              <UIButton
                priority="red"
                handleClick={onCancel}
                title={cancelText || 'Cancel'}
                {...cancelButtonProps}
              />
            ))}
        </div>
        {footer && <div className="confirmModal__footer">{footer}</div>}
      </div>
    </UIModal>
  );
}

export default ConfirmModal;
