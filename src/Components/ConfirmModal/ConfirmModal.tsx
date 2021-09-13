import React from 'react';
import classNames from 'classnames';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton, { UIButtonProps } from 'Components/UIComponents/UIButton';
import { UIModalProps } from 'Components/UIComponents/interfaces/UIModal';

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
  ...modalProps
}: ConfirmModalProps) {
  return (
    <UIModal onClose={onClose} {...modalProps}>
      <div className="confirmModal">
        <div className="confirmModal__content">{children}</div>
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
      </div>
    </UIModal>
  );
}

export default ConfirmModal;
