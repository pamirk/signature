import React, { useCallback, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';

import Icon from 'Assets/images/icons/checkbox-arrow.svg';

export interface UICheckboxProps {
  handleClick?: (label?: string) => void;
  label?: string;
  check?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

function UICheckbox({
  label,
  handleClick,
  check = false,
  disabled,
  children,
}: UICheckboxProps) {
  const handleCheckboxClick = useCallback(() => {
    if (!disabled && handleClick) handleClick(label);
  }, [disabled, handleClick, label]);
  const disabledClassName = useMemo(() => disabled && 'uiCheckbox--disabled', [disabled]);

  return (
    <div
      onClick={handleCheckboxClick}
      className={classNames('uiCheckbox', disabledClassName)}
    >
      <div className="uiCheckbox__wrapper">
        {check ? (
          <div
            className={classNames(
              'uiCheckbox__inner uiCheckbox--checked',
              disabledClassName,
            )}
          >
            <ReactSVG src={Icon} className="uiCheckbox__icon" />
          </div>
        ) : (
          <div
            className={classNames(
              'uiCheckbox__inner uiCheckbox--unChecked',
              disabledClassName,
            )}
          />
        )}
        {(label || children) && (
          <p className={classNames('uiCheckbox__label', disabledClassName)}>
            {label || children}
          </p>
        )}
      </div>
    </div>
  );
}

export default UICheckbox;
